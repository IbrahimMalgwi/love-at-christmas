import { useState, useEffect, useCallback } from 'react'
import { database, supabase } from '../services/supabaseClient'
import { useAuth } from './useAuth'

export const useParticipants = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, isVolunteer, isAdmin } = useAuth() // Get user here

    const fetchData = useCallback(async () => {
        if (!isVolunteer() && !isAdmin()) {
            setError('Unauthorized: Only volunteers and admins can access participants data')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const { data: result, error } = await database.getParticipants()

            if (error) throw error
            setData(result || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [isVolunteer, isAdmin])

    const createParticipant = useCallback(async (participantData) => {
        if (!user || (!isVolunteer() && !isAdmin())) {
            throw new Error('Unauthorized: Only volunteers and admins can register participants')
        }

        const { data: result, error } = await database.createParticipant(participantData, user.id)

        if (error) throw error
        await fetchData()
        return result
    }, [user, isVolunteer, isAdmin, fetchData])

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
            const { data: result, error } = await database.getVolunteers()

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
            const { data: result, error } = await database.getItems()

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
    const { user } = useAuth() // Get user here

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const { data: result, error } = await database.getEvents()

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

        const { data: result, error } = await database.registerForEvent(eventId, user.id)

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