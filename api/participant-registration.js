const { webcrypto } = require('node:crypto');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { FieldValue, getFirestore } = require('firebase-admin/firestore');

function registrationData(body, normalizePhone) {
    if (!body || typeof body !== 'object') return null;
    const text = field => typeof body[field] === 'string' ? body[field].trim() : '';
    const full_name = text('full_name');
    const phone = normalizePhone(body.phone);
    const address = text('address');
    const special_needs = text('special_needs');
    const { sex, age, religion } = body;

    if (!full_name || full_name.length > 200 || !phone || !address || address.length > 1000
        || !['male', 'female'].includes(sex) || !Number.isInteger(age) || age < 0 || age > 120
        || !['christianity', 'islam', 'others'].includes(religion) || special_needs.length > 4000) {
        return null;
    }
    return { full_name, phone, address, sex, age, religion, special_needs };
}

function configurationError(reason) {
    return Object.assign(new Error('Firebase Admin credentials are unavailable or invalid.'), {
        code: 'registration/firebase-config',
        reason
    });
}

function database() {
    if (!getApps().length) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
        const useEmulators = process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST;
        if (process.env.VERCEL === '1' && !serviceAccount && !process.env.GOOGLE_APPLICATION_CREDENTIALS && !useEmulators) {
            throw configurationError('credentials-missing');
        }
        if (serviceAccount) {
            let credentials;
            try {
                credentials = JSON.parse(serviceAccount);
            } catch {
                throw configurationError('service-account-json-invalid');
            }
            if (!credentials || typeof credentials !== 'object') {
                throw configurationError('service-account-invalid');
            }
            if (projectId && credentials.project_id !== projectId) {
                throw configurationError('project-id-mismatch');
            }
            try {
                initializeApp({ credential: cert(credentials), projectId });
            } catch {
                throw configurationError('service-account-invalid');
            }
        } else {
            initializeApp({ projectId });
        }
    }
    return getFirestore();
}

function unavailable(res, stage, error) {
    const code = error?.code;
    const configurationFailure = ['registration/firebase-config', 'app/invalid-credential', 'app/credential-error',
        'auth/invalid-credential', 'auth/insufficient-permission', 'auth/project-not-found',
        7, 16, 'permission-denied', 'unauthenticated'].includes(code);
    const knownCode = configurationFailure || (Number.isInteger(code) && code >= 1 && code <= 16);
    console.error('Participant registration failed', {
        stage,
        code: knownCode ? code : 'unknown',
        ...(['credentials-missing', 'service-account-json-invalid', 'project-id-mismatch', 'service-account-invalid']
            .includes(error?.reason) && { reason: error.reason })
    });
    if (configurationFailure) {
        return res.status(503).json({ code: 'registration-unconfigured' });
    }
    return res.status(503).json({ code: 'registration-unavailable' });
}

async function requestBody(req) {
    if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const chunks = [];
    let length = 0;
    for await (const chunk of req) {
        length += chunk.length;
        if (length > 32768) return null;
        chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

module.exports = async function registerParticipant(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Use POST to register.' });
    }

    const token = /^Bearer (\S+)$/i.exec(req.headers.authorization || '')?.[1];
    if (!token) return res.status(401).json({ error: 'Sign in to register.' });

    let db;
    try {
        db = database();
    } catch (error) {
        return unavailable(res, 'firebase-initialization', error);
    }

    try {
        const identity = await getAuth().verifyIdToken(token, true);
        if (identity.firebase?.sign_in_provider === 'anonymous') {
            return res.status(401).json({ error: 'Sign in to register.' });
        }
    } catch (error) {
        if (['auth/argument-error', 'auth/invalid-id-token', 'auth/id-token-expired', 'auth/id-token-revoked', 'auth/user-disabled', 'auth/user-not-found'].includes(error.code)) {
            return res.status(401).json({ error: 'Sign in to register.' });
        }
        return unavailable(res, 'firebase-authentication', error);
    }

    let stage = 'registration-preparation';
    try {
        const [{ normalizePhone, participantKey }, { currentRegistrationYear, registrationYear }] = await Promise.all([
            import('../src/shared/participantIdentity.mjs'),
            import('../src/shared/registrationYear.mjs')
        ]);
        const data = registrationData(await requestBody(req).catch(() => null), normalizePhone);
        if (!data) return res.status(400).json({ error: 'Check the registration details and try again.' });
        const key = await participantKey(data.full_name, data.phone, webcrypto);
        const campaignYear = currentRegistrationYear();
        const participants = db.collection('participants');
        // The deterministic document ID makes simultaneous submissions contend on the same document.
        const record = participants.doc(`${campaignYear}-${key}`);
        stage = 'firestore-transaction';
        await db.runTransaction(async transaction => {
            if ((await transaction.get(record)).exists) return;
            // Older records retain their original IDs after backfill.
            const previous = await transaction.get(participants.where('registrationKey', '==', key));
            if (previous.docs.some(snapshot => registrationYear(snapshot.data()) === campaignYear)) return;
            transaction.create(record, {
                ...data,
                campaignYear,
                registrationKey: key,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });
        });
        // Keep responses identical so this form cannot be used as a registration lookup.
        return res.status(200).json({ ok: true });
    } catch (error) {
        return unavailable(res, stage, error);
    }
};
