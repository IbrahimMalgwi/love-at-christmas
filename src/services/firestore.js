import { limit } from 'firebase/firestore';
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

const getDatabase = () => {
    if (!db) throw new Error('Firebase is not configured.');
    return db;
};

// Generic CRUD operations
export const firestoreService = {
    // Get all documents from a collection
    getAll: async (collectionName, orderField = 'createdAt', orderDirection = 'desc', maximum) => {
        try {
            const q = query(
                collection(getDatabase(), collectionName),
                ...(orderField ? [orderBy(orderField, orderDirection)] : []),
                ...(maximum ? [limit(maximum)] : [])
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            throw error;
        }
    },

    // Get documents with conditions
    getWhere: async (collectionName, field, operator, value, orderField = 'createdAt') => {
        try {
            const q = query(
                collection(getDatabase(), collectionName),
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
            throw error;
        }
    },

    // Get single document
    getById: async (collectionName, id) => {
        try {
            const docRef = doc(getDatabase(), collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching ${collectionName}/${id}:`, error);
            throw error;
        }
    },

    // Add document
    add: async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(getDatabase(), collectionName), {
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
            const docRef = doc(getDatabase(), collectionName, id);
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
            await deleteDoc(doc(getDatabase(), collectionName, id));
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