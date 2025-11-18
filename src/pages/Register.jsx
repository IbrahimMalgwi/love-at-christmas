import React, { useState } from 'react'
import { Users, Heart } from 'lucide-react'
import ParticipantForm from '../components/forms/ParticipantForm'
import VolunteerForm from '../components/forms/VolunteerForm'

const Register = () => {
    const [activeTab, setActiveTab] = useState('participant')

    const tabs = [
        {
            id: 'participant',
            name: 'Participant Registration',
            icon: Users,
            description: 'Register to receive support and join our Christmas event'
        },
        {
            id: 'volunteer',
            name: 'Volunteer Registration',
            icon: Heart,
            description: 'Join our team and help spread love this Christmas season'
        }
    ]

    const handleSuccess = (data) => {
        console.log('Registration successful:', data)
        // You can add additional success handling here
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Get Involved
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Whether you want to receive support or volunteer your time, there's a place for you at Love At Christmas.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="h-5 w-5 mr-2" />
                                    {tab.name}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'participant' && (
                        <div>
                            <div className="text-center mb-8">
                                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Participant Registration
                                </h2>
                                <p className="text-gray-600">
                                    Register to be part of our Christmas event and receive support for your family.
                                </p>
                            </div>
                            <ParticipantForm onSuccess={handleSuccess} />
                        </div>
                    )}

                    {activeTab === 'volunteer' && (
                        <div>
                            <div className="text-center mb-8">
                                <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Volunteer Registration
                                </h2>
                                <p className="text-gray-600">
                                    Join our amazing team of volunteers and help make this Christmas special for families in need.
                                </p>
                            </div>
                            <VolunteerForm onSuccess={handleSuccess} />
                        </div>
                    )}
                </div>

                {/* Additional Information */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Need Help?
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                                <p>Email: info@loveatchristmas.org</p>
                                <p>Phone: +1 (555) 123-4567</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Registration Support</h4>
                                <p>Our team is available to help you with the registration process and answer any questions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register