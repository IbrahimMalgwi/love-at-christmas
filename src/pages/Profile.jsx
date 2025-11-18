import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Shield, Heart } from 'lucide-react'

const Profile = () => {
    const { user, profile: authProfile, updateProfile } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({})

    const fetchProfile = useCallback(async () => {
        if (!user) return

        try {
            let userProfile = authProfile

            // If we don't have profile from auth context, fetch it
            if (!userProfile) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error) throw error
                userProfile = data
            }

            // Fetch additional data based on user role
            let additionalData = {}
            if (userProfile?.user_role === 'participant') {
                const { data: participantData } = await supabase
                    .from('participants')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                additionalData = participantData || {}
            } else if (userProfile?.user_role === 'volunteer') {
                const { data: volunteerData } = await supabase
                    .from('volunteers')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                additionalData = volunteerData || {}
            }

            const fullProfile = { ...userProfile, ...additionalData }
            setProfile(fullProfile)
            setFormData(fullProfile)
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }, [user, authProfile])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    const handleSave = async () => {
        setSaving(true)
        try {
            // Update profile in profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            // Update additional data based on user role
            if (profile.user_role === 'participant') {
                const { error: participantError } = await supabase
                    .from('participants')
                    .update({
                        full_name: formData.full_name,
                        phone_number: formData.phone,
                        address: formData.address,
                        sex: formData.sex,
                        age: formData.age,
                        religion: formData.religion,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)

                if (participantError) throw participantError
            } else if (profile.user_role === 'volunteer') {
                const { error: volunteerError } = await supabase
                    .from('volunteers')
                    .update({
                        full_name: formData.full_name,
                        phone_number: formData.phone,
                        church: formData.church,
                        role: formData.role,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)

                if (volunteerError) throw volunteerError
            }

            // Update auth context profile
            if (updateProfile) {
                await updateProfile({
                    full_name: formData.full_name,
                    phone: formData.phone
                })
            }

            setProfile(formData)
            setEditing(false)
            alert('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Error updating profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setFormData(profile)
        setEditing(false)
    }

    const getRoleDisplay = (role) => {
        const roleMap = {
            'admin': 'Administrator',
            'volunteer': 'Volunteer',
            'participant': 'Participant'
        }
        return roleMap[role] || role
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="h-5 w-5" />
            case 'volunteer': return <Heart className="h-5 w-5" />
            default: return <User className="h-5 w-5" />
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800'
            case 'volunteer': return 'bg-blue-100 text-blue-800'
            default: return 'bg-green-100 text-green-800'
        }
    }

    if (loading) return <LoadingSpinner size="lg" className="min-h-screen flex items-center justify-center" />
    if (!user) return <div className="min-h-screen flex items-center justify-center">Please sign in to view your profile.</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white">
                            <div className="p-6 text-center">
                                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {getRoleIcon(profile?.user_role)}
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg">{profile?.full_name || 'User'}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                {profile?.user_role && (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(profile.user_role)}`}>
                                        {getRoleDisplay(profile.user_role)}
                                    </span>
                                )}
                            </div>
                        </Card>

                        <Card className="bg-white">
                            <div className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        My Registrations
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Event History
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Notification Settings
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-white">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                    {!editing ? (
                                        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={handleSave} loading={saving}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.full_name || ''}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            ) : (
                                                <div className="flex items-center text-gray-900">
                                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                                    {profile?.full_name || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="flex items-center text-gray-900">
                                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone
                                            </label>
                                            {editing ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone || ''}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            ) : (
                                                <div className="flex items-center text-gray-900">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    {profile?.phone || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                User Role
                                            </label>
                                            <div className="flex items-center text-gray-900">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {getRoleDisplay(profile?.user_role)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Fields based on user role */}
                                    {profile?.user_role === 'participant' && (
                                        <div className="border-t pt-6">
                                            <h4 className="font-semibold text-gray-900 mb-4">Participant Information</h4>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Address
                                                    </label>
                                                    {editing ? (
                                                        <textarea
                                                            value={formData.address || ''}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-start text-gray-900">
                                                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                                                            {profile?.address || 'Not provided'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Sex
                                                        </label>
                                                        {editing ? (
                                                            <select
                                                                value={formData.sex || ''}
                                                                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        ) : (
                                                            <div className="text-gray-900">{profile?.sex || 'Not provided'}</div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Age
                                                        </label>
                                                        {editing ? (
                                                            <input
                                                                type="number"
                                                                value={formData.age || ''}
                                                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || '' })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-900">{profile?.age || 'Not provided'}</div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Religion
                                                        </label>
                                                        {editing ? (
                                                            <input
                                                                type="text"
                                                                value={formData.religion || ''}
                                                                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-900">{profile?.religion || 'Not provided'}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {profile?.user_role === 'volunteer' && (
                                        <div className="border-t pt-6">
                                            <h4 className="font-semibold text-gray-900 mb-4">Volunteer Information</h4>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Church/Organization
                                                    </label>
                                                    {editing ? (
                                                        <input
                                                            type="text"
                                                            value={formData.church || ''}
                                                            onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <div className="text-gray-900">{profile?.church || 'Not provided'}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Role
                                                    </label>
                                                    {editing ? (
                                                        <select
                                                            value={formData.role || ''}
                                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                        >
                                                            <option value="">Select Role</option>
                                                            <option value="publicity_media">Publicity/Media</option>
                                                            <option value="finance">Finance</option>
                                                            <option value="aesthetics_ambiance">Aesthetics/Ambiance</option>
                                                            <option value="prayer_counseling">Prayer and Counseling</option>
                                                            <option value="registration">Registration</option>
                                                            <option value="security">Security</option>
                                                            <option value="logistics">Logistics</option>
                                                        </select>
                                                    ) : (
                                                        <div className="text-gray-900">
                                                            {formData.role ? formData.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not assigned'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Activity Summary */}
                        <Card className="bg-white">
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">Account Created</p>
                                            <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {profile?.created_at && (
                                        <div className="flex justify-between items-center py-2">
                                            <div>
                                                <p className="font-medium text-gray-900">Profile Created</p>
                                                <p className="text-sm text-gray-600">{new Date(profile.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    {profile?.updated_at && profile.updated_at !== profile.created_at && (
                                        <div className="flex justify-between items-center py-2">
                                            <div>
                                                <p className="font-medium text-gray-900">Last Updated</p>
                                                <p className="text-sm text-gray-600">{new Date(profile.updated_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile