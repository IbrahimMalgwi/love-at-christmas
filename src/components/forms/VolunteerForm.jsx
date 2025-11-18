import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, TABLES } from '../../services/supabaseClient'
import Button from '../common/Button'
import Card from '../common/Card'

const VolunteerForm = ({ onSuccess }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        church: '',
        role: ''
    })

    const volunteerRoles = [
        'Publicity/Media',
        'Finance',
        'Aesthetics/Ambiance',
        'Prayer and Counseling',
        'Registration',
        'Security',
        'Logistics'
    ]

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase
                .from(TABLES.VOLUNTEERS)
                .insert([
                    {
                        ...formData,
                        user_id: user?.id
                    }
                ])
                .select()

            if (error) throw error

            // Reset form
            setFormData({
                full_name: '',
                phone_number: '',
                church: '',
                role: ''
            })

            if (onSuccess) {
                onSuccess(data[0])
            }

            alert('Volunteer registration successful! We will contact you soon.')
        } catch (error) {
            console.error('Error registering volunteer:', error)
            alert('Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Registration</h2>

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
                            placeholder="Enter your full name"
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

                        {/* Church */}
                        <div>
                            <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-2">
                                Church / Organization
                            </label>
                            <input
                                type="text"
                                id="church"
                                name="church"
                                value={formData.church}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter your church or organization"
                            />
                        </div>
                    </div>

                    {/* Volunteer Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Volunteer Role *
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
                            {volunteerRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {/* Role Descriptions */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Role Descriptions:</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Publicity/Media:</strong> Social media, photography, content creation</p>
                            <p><strong>Finance:</strong> Donation tracking, financial management</p>
                            <p><strong>Aesthetics/Ambiance:</strong> Event decoration, venue setup</p>
                            <p><strong>Prayer and Counseling:</strong> Spiritual support, counseling</p>
                            <p><strong>Registration:</strong> Attendee check-in, information desk</p>
                            <p><strong>Security:</strong> Crowd management, safety monitoring</p>
                            <p><strong>Logistics:</strong> Transportation, supplies management</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                    >
                        Register as Volunteer
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                        Thank you for your willingness to serve! We'll contact you with next steps.
                    </p>
                </form>
            </div>
        </Card>
    )
}

export default VolunteerForm