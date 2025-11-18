import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useVolunteers } from '../../hooks/useData'
import Button from '../common/Button'
import Card from '../common/Card'
import { useNotifications } from '../../hooks/useNotifications'
import { Mail, Lock, Eye, EyeOff, User, Phone, Church } from 'lucide-react'

const VolunteerForm = ({ onSuccess }) => {
    const { signUp, user } = useAuth()
    const { createVolunteer } = useVolunteers()
    const { addNotification } = useNotifications()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1) // 1: Account, 2: Volunteer Info

    const [accountData, setAccountData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const [volunteerData, setVolunteerData] = useState({
        church: '',
        role: '',
        availability: [],
        skills: []
    })

    // Handle account creation
    const handleAccountSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Validation
        if (accountData.password !== accountData.confirmPassword) {
            addNotification({
                type: 'error',
                title: 'Password mismatch',
                message: 'Passwords do not match'
            })
            setLoading(false)
            return
        }

        if (accountData.password.length < 6) {
            addNotification({
                type: 'error',
                title: 'Password too short',
                message: 'Password must be at least 6 characters'
            })
            setLoading(false)
            return
        }

        try {
            // Create user account
            const { data, error } = await signUp(
                accountData.email,
                accountData.password,
                {
                    full_name: accountData.full_name,
                    phone: accountData.phone,
                    user_role: 'volunteer' // Set role as volunteer
                }
            )

            if (error) throw error

            // Move to volunteer info step
            setStep(2)
            addNotification({
                type: 'success',
                title: 'Account created!',
                message: 'Please complete your volunteer information'
            })

        } catch (error) {
            console.error('Account creation failed:', error)
            addNotification({
                type: 'error',
                title: 'Account creation failed',
                message: error.message || 'Please try again with a different email.'
            })
        } finally {
            setLoading(false)
        }
    }

    // Handle volunteer registration
    const handleVolunteerSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const completeVolunteerData = {
                ...volunteerData,
                full_name: accountData.full_name,
                phone_number: accountData.phone
            }

            // Remove the const data assignment since it's not used
            await createVolunteer(completeVolunteerData)

            // Reset form
            setAccountData({
                full_name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            })
            setVolunteerData({
                church: '',
                role: '',
                availability: [],
                skills: []
            })

            if (onSuccess) {
                onSuccess(completeVolunteerData) // Pass the data to onSuccess if needed
            }

            addNotification({
                type: 'success',
                title: 'Registration complete!',
                message: 'Thank you for volunteering! You can now access all volunteer features.'
            })

        } catch (error) {
            console.error('Volunteer registration failed:', error)
            addNotification({
                type: 'error',
                title: 'Registration failed',
                message: error.message || 'Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    // If user is already logged in, just show volunteer form
    if (user && step === 1) {
        setStep(2)
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6">
                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                            1
                        </div>
                        <div className={`mx-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                            Account
                        </div>
                        <div className="w-12 h-1 bg-gray-300 mx-2"></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                            2
                        </div>
                        <div className={`mx-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                            Volunteer Info
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {step === 1 ? 'Create Your Account' : 'Volunteer Information'}
                </h2>

                {/* Step 1: Account Creation */}
                {step === 1 && (
                    <form onSubmit={handleAccountSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    id="full_name"
                                    required
                                    value={accountData.full_name}
                                    onChange={(e) => setAccountData({ ...accountData, full_name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={accountData.email}
                                        onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        required
                                        value={accountData.phone}
                                        onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    required
                                    value={accountData.password}
                                    onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    required
                                    value={accountData.confirmPassword}
                                    onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full"
                            size="lg"
                        >
                            Create Account & Continue
                        </Button>
                    </form>
                )}

                {/* Step 2: Volunteer Information */}
                {step === 2 && (
                    <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Account:</strong> {accountData.email}<br />
                                Complete your volunteer profile below.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-2">
                                Church
                            </label>
                            <div className="relative">
                                <Church className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    id="church"
                                    value={volunteerData.church}
                                    onChange={(e) => setVolunteerData({ ...volunteerData, church: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Your church (optional)"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Volunteering Role *
                            </label>
                            <select
                                id="role"
                                required
                                value={volunteerData.role}
                                onChange={(e) => setVolunteerData({ ...volunteerData, role: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Select a role</option>
                                <option value="publicity_media">Publicity/Media</option>
                                <option value="finance">Finance</option>
                                <option value="aesthetics_ambiance">Aesthetics/Ambiance</option>
                                <option value="prayer_counseling">Prayer and Counseling</option>
                                <option value="registration">Registration</option>
                                <option value="security">Security</option>
                                <option value="logistics">Logistics</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability
                                </label>
                                <div className="space-y-2">
                                    {['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings'].map(option => (
                                        <label key={option} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={volunteerData.availability.includes(option)}
                                                onChange={(e) => {
                                                    const newAvailability = e.target.checked
                                                        ? [...volunteerData.availability, option]
                                                        : volunteerData.availability.filter(a => a !== option)
                                                    setVolunteerData({ ...volunteerData, availability: newAvailability })
                                                }}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills & Interests
                                </label>
                                <div className="space-y-2">
                                    {['Event Planning', 'Communication', 'Counseling', 'Logistics', 'First Aid', 'Teaching'].map(skill => (
                                        <label key={skill} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={volunteerData.skills.includes(skill)}
                                                onChange={(e) => {
                                                    const newSkills = e.target.checked
                                                        ? [...volunteerData.skills, skill]
                                                        : volunteerData.skills.filter(s => s !== skill)
                                                    setVolunteerData({ ...volunteerData, skills: newSkills })
                                                }}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full"
                            size="lg"
                        >
                            Complete Volunteer Registration
                        </Button>

                        <p className="text-sm text-gray-600 text-center">
                            After registration, you'll be able to access volunteer features and manage participant registrations.
                        </p>
                    </form>
                )}
            </div>
        </Card>
    )
}

export default VolunteerForm