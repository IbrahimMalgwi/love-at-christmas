import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin authentication helper
export const adminAuth = {
    // Check if user is admin
    isAdmin: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return false

        const { data } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single()

        return !!data
    },

    // Get admin user data
    getAdminUser: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', user.id)
            .single()

        return data
    },

    // Create admin user (run this once to create your first admin)
    createAdmin: async (email, password, fullName) => {
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) throw authError

        // Then add to admin_users table
        const { error: adminError } = await supabase
            .from('admin_users')
            .insert([
                {
                    id: authData.user.id,
                    email,
                    full_name: fullName
                }
            ])

        if (adminError) throw adminError

        return authData.user
    }
}