import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'

export const useSupabase = (table, query = '*') => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const { data: result, error } = await supabase
                .from(table)
                .select(query)

            if (error) throw error
            setData(result || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [table, query])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}