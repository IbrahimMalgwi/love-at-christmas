import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Admin authentication helper
export const adminAuth = {
    // Check if user is admin
    isAdmin: async () => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) return false;

            const { data, error } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .single();

            if (error) {
                // Handle "no rows returned" error
                if (error.code === 'PGRST116') {
                    return false;
                }
                console.error('Error checking admin status:', error);
                return false;
            }

            return !!data;
        } catch (error) {
            console.error('Error in isAdmin:', error);
            return false;
        }
    },

    // Get admin user data
    getAdminUser: async () => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) return null;

            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getAdminUser:', error);
            return null;
        }
    },

    // Create admin user (run this once to create your first admin)
    createAdmin: async (email, password, fullName) => {
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        // Then add to admin_users table
        const { error: adminError } = await supabase
            .from('admin_users')
            .insert([
                {
                    id: authData.user.id,
                    email,
                    full_name: fullName
                }
            ]);

        if (adminError) throw adminError;

        return authData.user;
    }
};