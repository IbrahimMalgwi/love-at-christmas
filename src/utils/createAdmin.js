import { adminAuth } from '../services/supabase';

// Run this function once to create your first admin user
export const createFirstAdmin = async () => {
    try {
        const admin = await adminAuth.createAdmin(
            'admin@loveatchristmas.org', // Change to your admin email
            'Admin123!', // Change to a secure password
            'System Administrator'
        );

        console.log('Admin user created successfully:', admin);
        return admin;
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
};

// Uncomment and run this in your browser console once to create the first admin
createFirstAdmin();