// src/components/forms/VolunteerForm.jsx
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import Card from '../common/Card'
import { useNotifications } from '../../hooks/useNotifications'
import { Mail, Lock, Eye, EyeOff, User, Phone, Church, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const VolunteerForm = ({ onSuccess }) => {
    const { signUp } = useAuth()
    const { addNotification } = useNotifications()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)

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

        // Prevent double submission
        if (loading) {
            console.log('⏳ Form already submitting, skipping...')
            return
        }

        setLoading(true)
        console.log('🚀 Starting volunteer registration...')

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
            console.log('📝 Creating user account...', {
                email: formData.email,
                hasRole: !!formData.role,
                hasChurch: !!formData.church
            })

            // Create user account
            const { data, error } = await signUp(
                formData.email,
                formData.password,
                {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    role: formData.role,
                    church: formData.church
                }
            )

            if (error) {
                console.error('❌ Signup error:', error)
                throw error
            }

            console.log('✅ User account created successfully')
            setRegistrationSuccess(true)

            // Reset form on success
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
            console.error('💥 Registration failed:', error)
        } finally {
            setLoading(false)
            console.log('🏁 Registration process completed')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleGoToLogin = () => {
        navigate('/login')
    }

    // Show success message after registration
    if (registrationSuccess) {
        return (
            <Card className="max-w-2xl mx-auto">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Registration Successful!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your account has been created successfully. Please sign in to complete your volunteer registration and access your dashboard.
                    </p>
                    <div className="space-y-4">
                        <Button
                            onClick={handleGoToLogin}
                            className="w-full"
                            size="lg"
                        >
                            Go to Login
                        </Button>
                        <Button
                            onClick={() => setRegistrationSuccess(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Register Another Volunteer
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Volunteer Registration
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 text-center">
                        <strong>Note:</strong> After registration, you'll need to sign in to complete your volunteer profile setup.
                    </p>
                </div>

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

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={handleGoToLogin}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>

                    <div className="text-xs text-gray-500 text-center">
                        Debug: {loading ? 'Loading...' : 'Ready'}
                    </div>
                </form>
            </div>
        </Card>
    )
}

export default VolunteerForm