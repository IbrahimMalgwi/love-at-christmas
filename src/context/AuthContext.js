import React, { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth, signInWithEmailAndPassword, signOut } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState({ user: null, admin: false, loading: !!auth });

    useEffect(() => {
        if (!auth) return;
        let revision = 0;
        const unsubscribe = onIdTokenChanged(auth, async user => {
            const currentRevision = ++revision;
            setSession({ user, admin: false, loading: !!user });
            if (!user) return;

            let admin = false;
            try {
                admin = (await user.getIdTokenResult()).claims.admin === true;
            } catch (error) {
                console.error('Could not check admin access', error);
            }
            if (currentRevision === revision) setSession({ user, admin, loading: false });
        });

        return () => {
            revision++;
            unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        if (!auth) throw new Error('Admin sign-in is unavailable until Firebase is configured.');
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const isAdmin = (await user.getIdTokenResult()).claims.admin === true;
        if (!isAdmin) await signOut(auth);
        return { isAdmin };
    };

    return (
        <AuthContext.Provider value={{
            ...session,
            login,
            logout: () => signOut(auth),
            isAuthenticated: !!session.user,
            isAdmin: session.admin
        }}>
            {children}
        </AuthContext.Provider>
    );
};
