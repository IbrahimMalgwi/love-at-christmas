import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useParticipants } from '../../hooks/useData'
import Button from '../common/Button'
import Card from '../common/Card'
import { useNotifications } from '../../hooks/useNotifications'

const ParticipantForm = ({ onSuccess }) => {
    const { user, isVolunteer, isAdmin } = useAuth()
    const { createParticipant } = useParticipants()
    const { addNotification } = useNotifications()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        address: '',
        sex: '',
        age: '',
        religion: '',
        family_size: 1
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check authorization
        if (!isVolunteer() && !isAdmin()) {
            addNotification({
                type: 'error',
                title: 'Unauthorized',
                message: 'Only volunteers and administrators can register participants.'
            })
            return
        }

        setLoading(true)

        try {
            const participantData = {
                ...formData,
                user_id: user?.id, // Link to auth user if they want to login later
                age: parseInt(formData.age),
                family_size: parseInt(formData.family_size)
            }

            const data = await createParticipant(participantData)

            // Reset form
            setFormData({
                full_name: '',
                phone_number: '',
                address: '',
                sex: '',
                age: '',
                religion: '',
                family_size: 1
            })

            if (onSuccess) {
                onSuccess(data)
            }

            addNotification({
                type: 'success',
                title: 'Registration successful!',
                message: 'Participant has been registered successfully.'
            })
        } catch (error) {
            console.error('Error registering participant:', error)
            addNotification({
                type: 'error',
                title: 'Registration failed',
                message: error.message || 'Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    // Show message if not authorized
    if (!isVolunteer() && !isAdmin()) {
        return (
            <Card className="max-w-2xl mx-auto">
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Participant Registration</h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">
                            Participant registration can only be completed by volunteers and administrators.
                            Please contact a volunteer if you need assistance with registration.
                        </p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Participant</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            required
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter participant's full name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                required
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        {/* Sex */}
                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                                Sex *
                            </label>
                            <select
                                id="sex"
                                name="sex"
                                required
                                value={formData.sex}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Select sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Address *
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            required
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter complete address"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Age */}
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                                Age *
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                required
                                min="1"
                                max="120"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Age"
                            />
                        </div>

                        {/* Family Size */}
                        <div>
                            <label htmlFor="family_size" className="block text-sm font-medium text-gray-700 mb-2">
                                Family Size
                            </label>
                            <input
                                type="number"
                                id="family_size"
                                name="family_size"
                                min="1"
                                max="20"
                                value={formData.family_size}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Number of family members"
                            />
                        </div>

                        {/* Religion */}
                        <div>
                            <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-2">
                                Religion *
                            </label>
                            <input
                                type="text"
                                id="religion"
                                name="religion"
                                required
                                value={formData.religion}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Religion"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                    >
                        Register Participant
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                        Registered by: {user?.email} • {new Date().toLocaleDateString()}
                    </p>
                </form>
            </div>
        </Card>
    )
}

export default ParticipantForm