import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, adminAuth } from '../services/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);

                if (session?.user) {
                    const adminData = await adminAuth.getAdminUser();
                    setAdmin(adminData);
                } else {
                    setAdmin(null);
                }

                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const getSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const adminData = await adminAuth.getAdminUser();
                setAdmin(adminData);
            }
        } catch (error) {
            console.error('Error getting session:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check if user is admin
            const isAdmin = await adminAuth.isAdmin();
            if (!isAdmin) {
                await signOut();
                throw new Error('Access denied. Admin privileges required.');
            }

            const adminData = await adminAuth.getAdminUser();
            setAdmin(adminData);

            return { user: data.user, admin: adminData };
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setAdmin(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const value = {
        user,
        admin,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
        isAdmin: !!admin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};