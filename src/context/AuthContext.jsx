import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useNotifications } from '../hooks/useNotifications'

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addNotification } = useNotifications()

    const createUserProfile = useCallback(async (user, userData = {}) => {
        const profileData = {
            id: user.id,
            full_name: userData.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            phone: userData.phone || user.user_metadata?.phone || null,
            user_role: userData.user_role || user.user_metadata?.user_role || 'participant'
        }

        const { data, error } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single()

        if (error) {
            console.error('Error creating profile:', error)
            throw error
        }

        return data
    }, [])

    const fetchUserProfile = useCallback(async (user) => {
        try {
            console.log('Fetching profile for user:', user.id)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code === 'PGRST116') {
                // Profile doesn't exist, create one
                console.log('Profile not found, creating...')
                const { data: newProfile, error: createError } = await createUserProfile(user)

                if (createError) {
                    console.error('Error creating profile:', createError)
                    throw createError
                }

                setProfile(newProfile)
                return newProfile
            }

            if (error) {
                console.error('Error fetching profile:', error)
                throw error
            }

            setProfile(data)
            return data
        } catch (error) {
            console.error('Error in fetchUserProfile:', error)
            return null
        }
    }, [createUserProfile])

    useEffect(() => {
        let mounted = true

        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Session error:', error)
                    if (mounted) setLoading(false)
                    return
                }

                if (mounted) {
                    setUser(session?.user ?? null)
                    if (session?.user) {
                        await fetchUserProfile(session.user)
                    }
                    setLoading(false)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        initializeAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                console.log('Auth state changed:', event, session?.user?.email)

                setUser(session?.user ?? null)

                if (session?.user) {
                    await fetchUserProfile(session.user)
                    if (event === 'SIGNED_IN') {
                        addNotification({
                            type: 'success',
                            title: 'Welcome!',
                            message: 'You have successfully signed in.'
                        })
                    }
                } else {
                    setProfile(null)
                    if (event === 'SIGNED_OUT') {
                        addNotification({
                            type: 'info',
                            title: 'Signed out',
                            message: 'You have been signed out successfully.'
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
    }, [addNotification, fetchUserProfile])

    const signUp = async (email, password, userData = {}) => {
        try {
            console.log('Signing up user:', email)

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: userData.full_name,
                        phone: userData.phone,
                        user_role: userData.user_role
                    }
                }
            })

            if (error) {
                console.error('Signup error:', error)
                throw error
            }

            if (data.user) {
                console.log('User created, creating profile...')
                // Create profile for the new user with explicit user_role
                await createUserProfile(data.user, {
                    full_name: userData.full_name,
                    phone: userData.phone,
                    user_role: userData.user_role || 'participant'
                })

                addNotification({
                    type: 'success',
                    title: 'Account created!',
                    message: data.user.identities?.length === 0
                        ? 'Please check your email to confirm your account.'
                        : 'Account created successfully. You can now sign in.'
                })
            }

            return { data, error: null }
        } catch (error) {
            console.error('Signup failed:', error)
            addNotification({
                type: 'error',
                title: 'Signup failed',
                message: error.message || 'Please try again with a different email.'
            })
            return { data: null, error }
        }
    }

    const signIn = async (email, password) => {
        try {
            console.log('Signing in:', email)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                console.error('Signin error:', error)
                throw error
            }

            // Wait for profile to be fetched
            await new Promise(resolve => setTimeout(resolve, 1000))
            const currentProfile = await fetchUserProfile(data.user)

            // Updated: Allow volunteers and admins to login, restrict participants
            if (currentProfile?.user_role === 'participant') {
                await supabase.auth.signOut()
                throw new Error('Participants should use the registration form. Volunteers and administrators can login to the system.')
            }

            addNotification({
                type: 'success',
                title: 'Welcome back!',
                message: `Signed in as ${currentProfile?.full_name || email}`
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
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            setUser(null)
            setProfile(null)

            addNotification({
                type: 'info',
                title: 'Signed out',
                message: 'You have been signed out successfully.'
            })

            return { error: null }
        } catch (error) {
            console.error('Signout error:', error)
            addNotification({
                type: 'error',
                title: 'Sign out failed',
                message: error.message
            })
            return { error }
        }
    }

    const updateProfile = async (updates) => {
        if (!user) throw new Error('No user logged in')

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single()

            if (error) throw error

            setProfile(data)
            addNotification({
                type: 'success',
                title: 'Profile updated',
                message: 'Your profile has been updated successfully.'
            })

            return { data, error: null }
        } catch (error) {
            console.error('Profile update error:', error)
            addNotification({
                type: 'error',
                title: 'Update failed',
                message: error.message
            })
            return { data: null, error }
        }
    }

    // Role checking functions
    const hasRole = (roles) => {
        if (!profile) return false
        return Array.isArray(roles) ? roles.includes(profile.user_role) : profile.user_role === roles
    }

    const isAdmin = () => hasRole('admin')
    const isVolunteer = () => hasRole('volunteer')
    const isParticipant = () => hasRole('participant')
    const canManageParticipants = () => isAdmin() || isVolunteer()
    const canManageContent = () => isAdmin() || isVolunteer()

    const promoteToVolunteer = async (userId) => {
        if (!isAdmin()) {
            throw new Error('Only admins can promote users to volunteer')
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ user_role: 'volunteer' })
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile: () => user && fetchUserProfile(user),
        hasRole,
        isAdmin,
        isVolunteer,
        isParticipant,
        canManageParticipants,
        canManageContent,
        promoteToVolunteer
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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