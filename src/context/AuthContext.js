// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

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

    // Check if user is admin by checking admin_users table
    const checkAdminStatus = async (user) => {
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', user.email)
                .single();

            if (error || !data) {
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return null;
        }
    };

    useEffect(() => {
        // Get initial session
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    const adminData = await checkAdminStatus(currentUser);
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
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const adminData = await checkAdminStatus(currentUser);
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
            const adminData = await checkAdminStatus(data.user);
            if (!adminData) {
                await signOut();
                throw new Error('Access denied. Admin privileges required.');
            }

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