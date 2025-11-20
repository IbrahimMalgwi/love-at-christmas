// src/context/AuthContext.jsx
import React, { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../services/supabaseClient'
import { useNotifications } from '../hooks/useNotifications'

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addNotification } = useNotifications()

    // Function to create volunteer record (to be called after sign in)
    const createVolunteerAfterSignIn = async (user, userData) => {
        try {
            console.log('📝 Creating volunteer record after sign in...', {
                role: userData.role,
                church: userData.church
            });

            const volunteerData = {
                user_id: user.id,
                full_name: userData.full_name,
                phone_number: userData.phone,
                church: userData.church || '',
                role: userData.role,
                status: 'active'
            };

            console.log('📤 Inserting volunteer data:', volunteerData);

            const { error: volunteerError } = await supabase
                .from('volunteers')
                .insert([volunteerData]);

            if (volunteerError) {
                console.error('❌ Volunteer insert error:', volunteerError);
                return false;
            } else {
                console.log('✅ Volunteer record created successfully');
                return true;
            }
        } catch (error) {
            console.error('💥 Volunteer creation error:', error);
            return false;
        }
    }

    const signUp = async (email, password, userData = {}) => {
        try {
            console.log('🚀 Starting signup process...', {
                email: email.substring(0, 10) + '...',
                hasRole: !!userData.role,
                hasChurch: !!userData.church
            });

            // Create auth user
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                    data: {
                        full_name: userData.full_name?.trim() || '',
                        phone: userData.phone?.trim() || '',
                        user_role: 'volunteer',
                        // Store volunteer data in metadata for later use
                        volunteer_role: userData.role,
                        volunteer_church: userData.church
                    }
                }
            });

            if (error) {
                console.error('❌ Auth signup error:', error);
                throw error;
            }

            console.log('✅ Auth user created:', data.user?.id);

            // Store volunteer data in localStorage for after first sign in
            if (userData.role) {
                const pendingVolunteer = {
                    user_id: data.user.id,
                    full_name: userData.full_name,
                    phone: userData.phone,
                    role: userData.role,
                    church: userData.church
                };
                localStorage.setItem(`pending_volunteer_${data.user.id}`, JSON.stringify(pendingVolunteer));
                console.log('💾 Saved volunteer data for after sign in');
            }

            addNotification({
                type: 'success',
                title: 'Account created!',
                message: data.user?.identities?.length === 0
                    ? 'Please check your email to confirm your account, then sign in to complete your volunteer registration.'
                    : 'Account created successfully. Please sign in to complete your volunteer registration.'
            });

            console.log('🎉 Signup process completed - redirect to login');
            return { data, error: null };

        } catch (error) {
            console.error('💥 Signup process failed:', error);
            addNotification({
                type: 'error',
                title: 'Signup failed',
                message: error.message || 'Please try again with a different email.'
            });
            return { data: null, error };
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            console.log('✅ User signed in:', data.user.id);

            // Check if there's a pending volunteer record to create
            const pendingVolunteerKey = `pending_volunteer_${data.user.id}`;
            const pendingVolunteer = localStorage.getItem(pendingVolunteerKey);

            if (pendingVolunteer) {
                console.log('🔄 Found pending volunteer record, creating now...');
                const volunteerData = JSON.parse(pendingVolunteer);

                const success = await createVolunteerAfterSignIn(data.user, volunteerData);

                if (success) {
                    // Remove from localStorage
                    localStorage.removeItem(pendingVolunteerKey);
                    addNotification({
                        type: 'success',
                        title: 'Volunteer profile completed!',
                        message: 'Your volunteer registration is now complete.'
                    });
                } else {
                    addNotification({
                        type: 'warning',
                        title: 'Volunteer profile pending',
                        message: 'Your account was created, but we need to complete your volunteer profile. Please try again or contact support.'
                    });
                }
            }

            // Only volunteers and admins can login - participants don't have login access
            const userRole = data.user?.user_metadata?.user_role || 'volunteer';
            if (userRole === 'participant') {
                await supabase.auth.signOut()
                throw new Error('Only volunteers and administrators can login to the system. Participants are registered by volunteers.')
            }

            addNotification({
                type: 'success',
                title: 'Welcome back!',
                message: `Signed in as ${data.user?.user_metadata?.full_name || email}`
            })

            return { data, error: null }
        } catch (error) {
            console.error('Login failed:', error)
            addNotification({
                type: 'error',
                title: 'Login failed',
                message: error.message
            })
            return { data: null, error }
        }
    }

    const signOut = async () => {
        try {
            // Clear local state first to ensure UI updates immediately
            setUser(null)

            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('Supabase signout error:', error)
            }

            addNotification({
                type: 'info',
                title: 'Signed out',
                message: 'You have been signed out successfully.'
            })

            return { error: null }
        } catch (error) {
            console.error('Signout process error:', error)
            return { error }
        }
    }

    // Simple role checking from user metadata
    const hasRole = (roles) => {
        if (!user) return false
        const userRole = user.user_metadata?.user_role || 'volunteer'
        return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles
    }

    const isAdmin = () => hasRole('admin')
    const isVolunteer = () => hasRole('volunteer')
    const isParticipant = () => hasRole('participant')
    const canManageParticipants = () => isAdmin() || isVolunteer()
    const canManageContent = () => isAdmin() || isVolunteer()

    useEffect(() => {
        let mounted = true

        const initializeAuth = async () => {
            try {
                console.log('🔄 Initializing auth...')
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('❌ Session error:', error)
                    if (mounted) {
                        setLoading(false)
                    }
                    return
                }

                console.log('🔐 Session data:', session)

                if (mounted) {
                    setUser(session?.user ?? null)
                    setLoading(false)
                    console.log('✅ Auth initialization complete')
                }
            } catch (error) {
                console.error('💥 Auth initialization error:', error)
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        initializeAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('🔄 Auth state changed:', event)
                if (!mounted) return

                setUser(session?.user ?? null)

                if (session?.user) {
                    if (event === 'SIGNED_IN') {
                        addNotification({
                            type: 'success',
                            title: 'Welcome!',
                            message: 'You have successfully signed in.'
                        })
                    }
                }

                setLoading(false)
            }
        )

        return () => {
            mounted = false
            subscription?.unsubscribe()
        }
    }, [addNotification])

    const value = {
        user,
        profile: user ? {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            phone: user.user_metadata?.phone || null,
            user_role: user.user_metadata?.user_role || 'volunteer'
        } : null,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile: async (updates) => {
            // Update user metadata instead of profiles table
            const { error } = await supabase.auth.updateUser({
                data: updates
            });
            if (error) throw error;

            // Refresh user data
            const { data: { user: updatedUser } } = await supabase.auth.getUser();
            setUser(updatedUser);

            addNotification({
                type: 'success',
                title: 'Profile updated',
                message: 'Your profile has been updated successfully.'
            });

            return { data: updates, error: null };
        },
        refreshProfile: () => supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
            setUser(currentUser);
            return currentUser;
        }),
        hasRole,
        isAdmin,
        isVolunteer,
        isParticipant,
        canManageParticipants,
        canManageContent
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}