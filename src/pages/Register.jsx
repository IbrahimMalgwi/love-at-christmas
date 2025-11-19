import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users } from 'lucide-react'
import VolunteerForm from '../components/forms/VolunteerForm'
import ParticipantForm from '../components/forms/ParticipantForm'
import Card from '../components/common/Card'
import { useAuth } from '../context/AuthContext'

const Register = () => {
    const { user, isVolunteer, isAdmin } = useAuth()

    // Simple logic: show volunteer form if not logged in, participant form if logged in as volunteer/admin
    const showVolunteerForm = !user
    const showParticipantForm = user && (isVolunteer() || isAdmin())

    const handleSuccess = (data) => {
        console.log('Registration successful:', data)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {showVolunteerForm ? 'Volunteer Registration' : 'Participant Registration'}
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto">
                            {showVolunteerForm
                                ? 'Join our amazing team of volunteers and help make this Christmas special for families in need.'
                                : 'Register participants to receive support and join our Christmas celebration.'
                            }
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Volunteer Form */}
                {showVolunteerForm && (
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-6">
                            <Heart className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Join Our Volunteer Team
                            </h2>
                            <p className="text-gray-600">
                                Complete the form below to register as a volunteer.
                            </p>
                        </div>
                        <VolunteerForm onSuccess={handleSuccess} />
                    </div>
                )}

                {/* Participant Form */}
                {showParticipantForm && (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-6">
                            <Users className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Register Participant
                            </h2>
                            <p className="text-gray-600">
                                Register participants to receive support and join our Christmas celebration.
                            </p>
                        </div>
                        <ParticipantForm onSuccess={handleSuccess} />
                    </div>
                )}

                {/* Access denied for participants */}
                {user && !isVolunteer() && !isAdmin() && (
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-yellow-50 border-yellow-200">
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                                    Access Required
                                </h3>
                                <p className="text-yellow-800">
                                    Participant registration can only be completed by volunteers and administrators.
                                    Please contact a volunteer if you need assistance.
                                </p>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Help Cards */}
                <div className="max-w-4xl mx-auto mt-8 grid gap-6 md:grid-cols-2">
                    <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Need Help?
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Email: foursquaregoseplchurchsabo@gmail.com</p>
                                <p>Phone: +234 810 465 7320</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                What's Next?
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {showVolunteerForm ? (
                                    <>
                                        <p>✓ Complete volunteer registration</p>
                                        <p>✓ Confirm your email</p>
                                        <p>✓ Access volunteer dashboard</p>
                                        <p>✓ Start registering participants</p>
                                    </>
                                ) : (
                                    <>
                                        <p>✓ Submit participant registration</p>
                                        <p>✓ Receive confirmation</p>
                                        <p>✓ Get event details</p>
                                        <p>✓ Join the celebration!</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Register