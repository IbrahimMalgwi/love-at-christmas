// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    const checkAdminStatus = useCallback(async (user) => {
        if (!user) return null;

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('id', user.id)  // Changed from email to id
                .single();

            if (error) {
                // Handle "no rows returned" error gracefully
                if (error.code === 'PGRST116') {
                    console.log('User is not an admin');
                    return null;
                }
                console.error('Error checking admin status:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return null;
        }
    }, []);

    const getSession = useCallback(async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
                setLoading(false);
                return;
            }

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const adminData = await checkAdminStatus(currentUser);
                setAdmin(adminData);
            }
        } catch (error) {
            console.error('Error in getSession:', error);
        } finally {
            setLoading(false);
        }
    }, [checkAdminStatus]);

    useEffect(() => {
        // Get initial session
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);
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
    }, [getSession, checkAdminStatus]);

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Login error:', error.message);
                throw new Error(error.message || 'Login failed');
            }

            // Check if user is admin
            const adminData = await checkAdminStatus(data.user);
            if (!adminData) {
                // Sign out if not admin
                await supabase.auth.signOut();
                throw new Error('Access denied. Admin privileges required.');
            }

            setAdmin(adminData);
            return { user: data.user, admin: adminData };
        } catch (error) {
            console.error('Sign in error:', error);
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