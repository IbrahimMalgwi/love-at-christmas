import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

const drafts = 'faq_drafts';
const published = 'faqs';

export async function saveFaq(values, entry, publish) {
    const publicRef = entry ? doc(db, published, entry.id) : doc(collection(db, published));
    const draftRef = doc(db, drafts, publicRef.id);
    const batch = writeBatch(db);
    const data = { ...values, createdAt: entry?.createdAt ?? serverTimestamp(), updatedAt: serverTimestamp() };

    if (publish) {
        batch.set(publicRef, data, { merge: true });
        batch.delete(draftRef);
    } else {
        batch.set(draftRef, data);
    }
    await batch.commit();
}

export async function deleteFaq(id) {
    const batch = writeBatch(db);
    batch.delete(doc(db, drafts, id));
    batch.delete(doc(db, published, id));
    await batch.commit();
}
