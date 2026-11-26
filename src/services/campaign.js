import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

export const impactFields = [
    ['itemsCollected', 'Items collected'],
    ['volunteers', 'Volunteers registered'],
    ['participants', 'Participants registered'],
    ['familiesSupported', 'Families supported']
];

const campaignRef = status => doc(db, 'campaign', status);

export function subscribeToCampaign(onChange, onError) {
    if (!db) {
        onError(new Error('Firebase is unavailable.'));
        return () => {};
    }
    return onSnapshot(campaignRef('published'), snapshot => onChange(snapshot.data() ?? null), onError);
}

export async function loadCampaignEditor() {
    const [draft, published] = await Promise.all(['draft', 'published'].map(status => getDoc(campaignRef(status))));
    return { draft: draft.data(), published: published.data() };
}

export async function saveCampaign(values, publish) {
    const data = { ...values, updatedAt: serverTimestamp() };
    if (!publish) return setDoc(campaignRef('draft'), data);
    const batch = writeBatch(db);
    batch.set(campaignRef('draft'), data);
    batch.set(campaignRef('published'), data);
    await batch.commit();
}
