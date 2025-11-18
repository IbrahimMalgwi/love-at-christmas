import React from 'react'
import { Heart } from 'lucide-react'
import VolunteerForm from '../components/forms/VolunteerForm'

const Register = () => {
    const handleSuccess = (data) => {
        console.log('Registration successful:', data)
        // You can add additional success handling here
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Volunteer Registration
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join our amazing team of volunteers and help make this Christmas special for families in need.
                    </p>
                </div>

                {/* Volunteer Registration Content */}
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <Heart className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Become a Volunteer
                        </h2>
                        <p className="text-gray-600">
                            Fill out the form below to join our volunteer team and help spread love this Christmas season.
                        </p>
                    </div>

                    <VolunteerForm onSuccess={handleSuccess} />
                </div>

                {/* Additional Information */}
                <div className="max-w-2xl mx-auto mt-12">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Need Help?
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                                <p>Email: foursquaregoseplchurchsabo@gmail.com</p>
                                <p>Phone: +234 810 465 7320</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Registration Support</h4>
                                <p>Our team is available to help you with the registration process and answer any questions.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note about Participant Registration */}
                <div className="max-w-2xl mx-auto mt-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <h4 className="font-medium text-blue-900 mb-2">
                            Looking for Participant Registration?
                        </h4>
                        <p className="text-blue-800 text-sm">
                            Participant registration is available to logged-in users only. Please log in to access participant registration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register