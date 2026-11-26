const { webcrypto } = require('node:crypto');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue, FieldPath } = require('firebase-admin/firestore');

async function main() {
    const [command, projectId, uid] = process.argv.slice(2);
    if (!projectId || !['grant-admin', 'publish-stats', 'index-participants'].includes(command) || (command === 'grant-admin' && !uid)) {
        throw new Error('Usage: node scripts/firebase-maintenance.cjs grant-admin PROJECT_ID UID | publish-stats PROJECT_ID | index-participants PROJECT_ID');
    }

    const app = initializeApp({ credential: applicationDefault(), projectId });
    if (command === 'grant-admin') {
        const auth = getAuth(app);
        const user = await auth.getUser(uid);
        await auth.setCustomUserClaims(uid, { ...user.customClaims, admin: true });
        console.log('Admin access granted. Sign in again to refresh the token.');
        return;
    }

    const db = getFirestore(app);
    if (command === 'index-participants') {
        const { participantKey } = await import('../src/shared/participantIdentity.mjs');
        const participants = db.collection('participants').orderBy(FieldPath.documentId()).limit(300);
        let cursor;
        let indexed = 0;
        let skipped = 0;
        while (true) {
            const page = await (cursor ? participants.startAfter(cursor) : participants).get();
            if (page.empty) break;
            const batch = db.batch();
            let changed = 0;
            for (const record of page.docs) {
                const data = record.data();
                const key = await participantKey(data.full_name, data.phone, webcrypto);
                if (!key) {
                    skipped++;
                } else if (data.registrationKey !== key) {
                    batch.update(record.ref, { registrationKey: key }, { lastUpdateTime: record.updateTime });
                    changed++;
                }
            }
            if (changed) await batch.commit();
            indexed += changed;
            cursor = page.docs.at(-1);
        }
        console.log(`Indexed ${indexed} participant records. Skipped ${skipped} records without a usable name and Nigerian phone number.`);
        return;
    }
    const [volunteers, participants] = await Promise.all(
        ['volunteers', 'participants'].map(name => db.collection(name).count().get())
    );
    await db.doc('public_stats/impact').set({
        volunteers: volunteers.data().count,
        participants: participants.data().count,
        updatedAt: FieldValue.serverTimestamp()
    });
    console.log('Published registration counts.');
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
