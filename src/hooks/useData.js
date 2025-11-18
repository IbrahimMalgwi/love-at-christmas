import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useParticipants = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, isVolunteer, isAdmin } = useAuth()

    const fetchData = useCallback(async () => {
        if (!isVolunteer() && !isAdmin()) {
            setError('Unauthorized: Only volunteers and admins can access participants data')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const { data: result, error } = await supabase
                .from('participants')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setData(result || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [isVolunteer, isAdmin])

    const createParticipant = useCallback(async (participantData) => {
        console.log('useParticipants: Creating participant with:', participantData)

        if (!user || (!isVolunteer() && !isAdmin())) {
            throw new Error('Unauthorized: Only volunteers and admins can register participants')
        }

        try {
            // Add required fields
            const dataToInsert = {
                ...participantData,
                registered_by: user.id,
                status: 'pending'
            }

            console.log('useParticipants: Inserting data:', dataToInsert)

            const { data: result, error } = await supabase
                .from('participants')
                .insert([dataToInsert])
                .select()
                .single()

            if (error) {
                console.error('useParticipants: Supabase error:', error)
                throw error
            }

            console.log('useParticipants: Participant created successfully:', result)

            // Update local state without refetching to avoid loops
            setData(prev => [result, ...prev])

            return result

        } catch (err) {
            console.error('useParticipants: Error in createParticipant:', err)
            throw err
        }
    }, [user, isVolunteer, isAdmin]) // Removed fetchData dependency

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        createParticipant
    }
}

export const useVolunteers = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const { data: result, error } = await supabase
                .from('volunteers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setData(result || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}

export const useItems = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const { data: result, error } = await supabase
                .from('items_needed')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setData(result || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateItem = useCallback(async (itemId, updates) => {
        const { data: result, error } = await supabase
            .from('items_needed')
            .update(updates)
            .eq('id', itemId)

        if (error) throw error
        await fetchData()
        return result
    }, [fetchData])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData, updateItem }
}

export const useEvents = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const { data: result, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true })

            if (error) throw error
            setData(result || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const registerForEvent = useCallback(async (eventId) => {
        if (!user) {
            throw new Error('You must be logged in to register for events')
        }

        const { data: result, error } = await supabase
            .from('event_registrations')
            .insert([
                {
                    event_id: eventId,
                    user_id: user.id,
                    status: 'registered'
                }
            ])
            .select()
            .single()

        if (error) throw error
        return result
    }, [user])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        registerForEvent
    }
}