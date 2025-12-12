// src/services/firestore.js
import {
    db,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from '../firebase/config';

// Generic CRUD operations
export const firestoreService = {
    // Get all documents from a collection
    getAll: async (collectionName, orderField = 'createdAt', orderDirection = 'desc') => {
        try {
            const q = query(
                collection(db, collectionName),
                orderBy(orderField, orderDirection)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            return [];
        }
    },

    // Get documents with conditions
    getWhere: async (collectionName, field, operator, value, orderField = 'createdAt') => {
        try {
            const q = query(
                collection(db, collectionName),
                where(field, operator, value),
                orderBy(orderField, 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error fetching ${collectionName} where ${field} ${operator} ${value}:`, error);
            return [];
        }
    },

    // Get single document
    getById: async (collectionName, id) => {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching ${collectionName}/${id}:`, error);
            return null;
        }
    },

    // Add document
    add: async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            throw error;
        }
    },

    // Update document
    update: async (collectionName, id, data) => {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            return { id, ...data };
        } catch (error) {
            console.error(`Error updating ${collectionName}/${id}:`, error);
            throw error;
        }
    },

    // Delete document
    delete: async (collectionName, id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return true;
        } catch (error) {
            console.error(`Error deleting ${collectionName}/${id}:`, error);
            throw error;
        }
    }
};

// Collection names (match your Firebase collections)
export const collections = {
    ADMIN_USERS: 'admin_users',
    ITEMS_INVENTORY: 'items_inventory',
    ITEMS_RECEIVED: 'items_received',
    VOLUNTEERS: 'volunteers',
    PARTICIPANTS: 'participants',
    FAQS: 'faqs',
    GALLERY_CATEGORIES: 'gallery_categories',
    GALLERY_IMAGES: 'gallery_images'
};