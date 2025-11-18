// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Use the correct environment variable access method
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vzgxczuuptiewnketnxd.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z3hjenV1cHRpZXdua2V0bnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDMyNjYsImV4cCI6MjA3ODk3OTI2Nn0.veDyoFK-8TBheYaoDZp-fDsXxf2wJTXucHA6N00DXvY'

// Debug log (remove in production)
console.log('Supabase URL configured:', supabaseUrl ? 'Yes' : 'No')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Database tables
export const TABLES = {
    PROFILES: 'profiles',
    PARTICIPANTS: 'participants',
    VOLUNTEERS: 'volunteers',
    ITEMS_NEEDED: 'items_needed',
    DONATIONS: 'donations',
    EVENTS: 'events',
    EVENT_REGISTRATIONS: 'event_registrations',
    GALLERY: 'gallery',
    NOTIFICATIONS: 'notifications'
}

// Helper functions
export const auth = {
    signUp: (email, password, userData) =>
        supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        }),

    signIn: (email, password) =>
        supabase.auth.signInWithPassword({ email, password }),

    signOut: () => supabase.auth.signOut(),

    getSession: () => supabase.auth.getSession(),

    onAuthStateChange: (callback) =>
        supabase.auth.onAuthStateChange(callback),

    resetPassword: (email) =>
        supabase.auth.resetPasswordForEmail(email)
}

// Database operations with enhanced error handling
export const database = {
    // Profiles
    getProfile: (userId) =>
        supabase.from(TABLES.PROFILES).select('*').eq('id', userId).single(),

    updateProfile: (userId, updates) =>
        supabase.from(TABLES.PROFILES).update(updates).eq('id', userId).select().single(),

    // Participants
    createParticipant: (participantData, registeredById) =>
        supabase.from(TABLES.PARTICIPANTS).insert([{
            ...participantData,
            registered_by: registeredById
        }]).select().single(),

    getParticipants: () =>
        supabase.from(TABLES.PARTICIPANTS).select(`
      *,
      profiles:registered_by(full_name)
    `).order('created_at', { ascending: false }),

    getParticipant: (participantId) =>
        supabase.from(TABLES.PARTICIPANTS).select('*').eq('id', participantId).single(),

    // Volunteers
    getVolunteers: () =>
        supabase.from(TABLES.VOLUNTEERS).select('*').order('created_at', { ascending: false }),

    createVolunteer: (volunteerData) =>
        supabase.from(TABLES.VOLUNTEERS).insert([volunteerData]).select().single(),

    // Items
    getItems: () =>
        supabase.from(TABLES.ITEMS_NEEDED).select('*').order('priority', { ascending: false }),

    updateItemQuantity: (itemId, newQuantity) =>
        supabase.from(TABLES.ITEMS_NEEDED).update({ current_quantity: newQuantity }).eq('id', itemId),

    // Events
    getEvents: () =>
        supabase.from(TABLES.EVENTS).select('*').order('event_date', { ascending: true }),

    createEvent: (eventData) =>
        supabase.from(TABLES.EVENTS).insert([eventData]).select().single(),

    registerForEvent: (eventId, userId) =>
        supabase.from(TABLES.EVENT_REGISTRATIONS).insert([{
            event_id: eventId,
            user_id: userId
        }]).select().single(),

    // Donations
    createDonation: (donationData) =>
        supabase.from(TABLES.DONATIONS).insert([donationData]).select().single(),

    getDonations: () =>
        supabase.from(TABLES.DONATIONS).select('*').order('created_at', { ascending: false }),

    // Gallery
    getGallery: () =>
        supabase.from(TABLES.GALLERY).select('*').order('created_at', { ascending: false }),

    uploadImage: (file, path) =>
        supabase.storage.from('gallery').upload(path, file),

    // Notifications
    getNotifications: (userId) =>
        supabase.from(TABLES.NOTIFICATIONS).select('*').eq('user_id', userId).order('created_at', { ascending: false }),

    markNotificationAsRead: (notificationId) =>
        supabase.from(TABLES.NOTIFICATIONS).update({ read: true }).eq('id', notificationId)
}

// Storage buckets
export const STORAGE_BUCKETS = {
    GALLERY: 'gallery',
    AVATARS: 'avatars',
    DOCUMENTS: 'documents'
}