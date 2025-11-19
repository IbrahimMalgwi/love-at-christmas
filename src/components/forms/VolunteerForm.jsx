// src/components/forms/VolunteerForm.jsx
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useVolunteers } from '../../hooks/useData'
import Button from '../common/Button'
import Card from '../common/Card'
import { useNotifications } from '../../hooks/useNotifications'
import { Mail, Lock, Eye, EyeOff, User, Phone, Church } from 'lucide-react'

const VolunteerForm = ({ onSuccess }) => {
    const { signUp } = useAuth()
    const { createVolunteer } = useVolunteers()
    const { addNotification } = useNotifications()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        church: '',
        role: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            addNotification({
                type: 'error',
                title: 'Password mismatch',
                message: 'Passwords do not match'
            })
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            addNotification({
                type: 'error',
                title: 'Password too short',
                message: 'Password must be at least 6 characters'
            })
            setLoading(false)
            return
        }

        if (!formData.role) {
            addNotification({
                type: 'error',
                title: 'Role required',
                message: 'Please select a volunteer role'
            })
            setLoading(false)
            return
        }

        try {
            // Create user account
            const { data, error } = await signUp(
                formData.email,
                formData.password,
                {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    user_role: 'volunteer'
                }
            )

            if (error) throw error

            // Create volunteer profile
            if (data.user) {
                const volunteerProfile = {
                    user_id: data.user.id,
                    full_name: formData.full_name,
                    phone_number: formData.phone,
                    church: formData.church,
                    role: formData.role
                }

                await createVolunteer(volunteerProfile)
            }

            // Reset form
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                church: '',
                role: ''
            })

            if (onSuccess) {
                onSuccess(data)
            }

        } catch (error) {
            console.error('Registration failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Volunteer Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone *
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* Church */}
                    <div>
                        <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-2">
                            Church
                        </label>
                        <div className="relative">
                            <Church className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                id="church"
                                name="church"
                                value={formData.church}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Your church (optional)"
                            />
                        </div>
                    </div>

                    {/* Volunteer Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Volunteering Role *
                        </label>
                        <select
                            id="role"
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Select a role</option>
                            <option value="Publicity/Media">Publicity/Media</option>
                            <option value="Finance">Finance</option>
                            <option value="Aesthetics/Ambiance">Aesthetics/Ambiance</option>
                            <option value="Prayer and Counseling">Prayer and Counseling</option>
                            <option value="Registration">Registration</option>
                            <option value="Security">Security</option>
                            <option value="Logistics">Logistics</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Create password (min. 6 characters)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password *
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? 'Creating Account...' : 'Register as Volunteer'}
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                        After registration, you'll be able to access volunteer features and manage participant registrations.
                    </p>
                </form>
            </div>
        </Card>
    )
}

export default VolunteerForm