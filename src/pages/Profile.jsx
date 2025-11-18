import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase, TABLES } from '../services/supabaseClient'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react'

const Profile = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({})

    const fetchProfile = useCallback(async () => {
        if (!user) return

        try {
            // Fetch user profile data
            const { data: userData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            // Fetch additional data based on user type
            let additionalData = {}
            if (userData?.user_type === 'participant') {
                const { data: participantData } = await supabase
                    .from(TABLES.PARTICIPANTS)
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                additionalData = participantData
            } else if (userData?.user_type === 'volunteer') {
                const { data: volunteerData } = await supabase
                    .from(TABLES.VOLUNTEERS)
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                additionalData = volunteerData
            }

            const fullProfile = { ...userData, ...additionalData }
            setProfile(fullProfile)
            setFormData(fullProfile)
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }, [user])

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
                    updated_at: new Date()
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            // Update additional data based on user type
            if (profile.user_type === 'participant') {
                const { error: participantError } = await supabase
                    .from(TABLES.PARTICIPANTS)
                    .update({
                        full_name: formData.full_name,
                        phone_number: formData.phone,
                        address: formData.address,
                        sex: formData.sex,
                        age: formData.age,
                        religion: formData.religion
                    })
                    .eq('user_id', user.id)

                if (participantError) throw participantError
            } else if (profile.user_type === 'volunteer') {
                const { error: volunteerError } = await supabase
                    .from(TABLES.VOLUNTEERS)
                    .update({
                        full_name: formData.full_name,
                        phone_number: formData.phone,
                        church: formData.church,
                        role: formData.role
                    })
                    .eq('user_id', user.id)

                if (volunteerError) throw volunteerError
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
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="h-10 w-10 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">{profile?.full_name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{profile?.user_type}</p>
                                {profile?.role && (
                                    <p className="text-sm text-primary-600 font-medium mt-1">{profile.role}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    My Registrations
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Event History
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Notification Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Personal Information</CardTitle>
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
                            </CardHeader>
                            <CardContent>
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
                                                    {profile?.full_name}
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
                                                User Type
                                            </label>
                                            <div className="flex items-center text-gray-900 capitalize">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {profile?.user_type}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Fields based on user type */}
                                    {profile?.user_type === 'participant' && (
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
                                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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

                                    {profile?.user_type === 'volunteer' && (
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
                                                            <option value="Publicity/Media">Publicity/Media</option>
                                                            <option value="Finance">Finance</option>
                                                            <option value="Aesthetics/Ambiance">Aesthetics/Ambiance</option>
                                                            <option value="Prayer and Counseling">Prayer and Counseling</option>
                                                            <option value="Registration">Registration</option>
                                                            <option value="Security">Security</option>
                                                            <option value="Logistics">Logistics</option>
                                                        </select>
                                                    ) : (
                                                        <div className="text-gray-900">{profile?.role || 'Not assigned'}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">Registration Completed</p>
                                            <p className="text-sm text-gray-600">December 1, 2024</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            Completed
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">Profile Updated</p>
                                            <p className="text-sm text-gray-600">November 28, 2024</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">Account Created</p>
                                            <p className="text-sm text-gray-600">November 15, 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile