import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from '../firebase/config';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Development check - logs only show in dev mode
const isDevelopment = process.env.NODE_ENV === 'development';

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

    // Check if user is admin
    const checkAdminStatus = async (userEmail) => {
        if (!userEmail) return null;

        try {
            const adminUsersRef = collection(db, 'admin_users');
            const q = query(
                adminUsersRef,
                where('email', '==', userEmail.toLowerCase()),
                where('role', '==', 'admin')
            );

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (isDevelopment) {
                console.log('Admin query results:', results);
            }

            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return null;
        }
    };

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName
                };

                if (isDevelopment) {
                    console.log('Auth state changed:', firebaseUser.email);
                }

                setUser(userData);

                // Check admin status using email
                const adminData = await checkAdminStatus(firebaseUser.email);

                if (isDevelopment && adminData) {
                    console.log('Admin data found:', adminData);
                }

                setAdmin(adminData);
            } else {
                if (isDevelopment) {
                    console.log('No user, clearing state');
                }
                setUser(null);
                setAdmin(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);

            if (isDevelopment) {
                console.log('Login attempt with:', email);
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const userData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email
            };

            if (isDevelopment) {
                console.log('Firebase auth successful:', userCredential.user.email);
            }

            // Check admin status
            const adminData = await checkAdminStatus(userCredential.user.email);

            setUser(userData);
            setAdmin(adminData);

            const result = {
                user: userData,
                admin: adminData,
                isAdmin: !!adminData
            };

            if (isDevelopment) {
                console.log('Login process complete. Result:', result);
            }

            return result;
        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }

            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setAdmin(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const value = {
        user,
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!admin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};