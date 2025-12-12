import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestoreService, collections } from '../services/firestore';

export const setupFirstAdmin = async (email, password, fullName) => {
    try {
        // 1. Create auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // 2. Add to admin_users collection
        const adminData = {
            userId: userId,
            email: email,
            fullName: fullName,
            createdAt: new Date().toISOString(),
            role: 'admin'
        };

        await firestoreService.add(collections.adminUsers, adminData);

        console.log('✅ Admin user created successfully!');
        console.log('User ID:', userId);
        console.log('Email:', email);

        return { success: true, userId };
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        return { success: false, error: error.message };
    }
};