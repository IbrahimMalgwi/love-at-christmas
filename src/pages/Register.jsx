import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, UserCheck } from 'lucide-react'
import VolunteerForm from '../components/forms/VolunteerForm'
import ParticipantForm from '../components/forms/ParticipantForm'
import Card from '../components/common/Card'
import { useAuth } from '../context/AuthContext'

const Register = () => {
    const [activeTab, setActiveTab] = useState('volunteer')
    const { user, isVolunteer, isAdmin } = useAuth()

    const handleSuccess = (data) => {
        console.log('Registration successful:', data)
        // You can add additional success handling here
    }

    // Auto-switch to participant tab if user is logged in as volunteer/admin
    React.useEffect(() => {
        if ((isVolunteer() || isAdmin()) && activeTab === 'volunteer') {
            setActiveTab('participant')
        }
    }, [isVolunteer, isAdmin, activeTab])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Gradient */}
            <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {activeTab === 'volunteer' ? 'Volunteer Registration' : 'Participant Registration'}
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto">
                            {activeTab === 'volunteer'
                                ? 'Join our amazing team of volunteers and help make this Christmas special for families in need.'
                                : 'Register as a participant to receive support and join our Christmas celebration.'
                            }
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setActiveTab('volunteer')}
                            className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md transition-colors ${
                                activeTab === 'volunteer'
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                            }`}
                        >
                            <UserCheck className="h-5 w-5 mr-2" />
                            Become a Volunteer
                        </button>
                        <button
                            onClick={() => setActiveTab('participant')}
                            className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md transition-colors ${
                                activeTab === 'participant'
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                            }`}
                        >
                            <Users className="h-5 w-5 mr-2" />
                            Register as Participant
                        </button>
                    </div>
                </div>

                {/* Registration Content */}
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'volunteer' ? (
                        <div>
                            <div className="text-center mb-6">
                                <Heart className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Join Our Volunteer Team
                                </h2>
                                <p className="text-gray-600">
                                    Create an account and join our team to help spread love this Christmas season.
                                </p>
                            </div>
                            <VolunteerForm onSuccess={handleSuccess} />
                        </div>
                    ) : (
                        <div>
                            <div className="text-center mb-6">
                                <Users className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Register as Participant
                                </h2>
                                <p className="text-gray-600">
                                    {user && (isVolunteer() || isAdmin())
                                        ? 'Register participants to receive support and join our Christmas celebration.'
                                        : 'Register to receive support and join our Christmas celebration.'
                                    }
                                </p>
                            </div>
                            <ParticipantForm onSuccess={handleSuccess} />
                        </div>
                    )}
                </div>

                {/* Additional Information */}
                <div className="max-w-4xl mx-auto mt-8 grid gap-6 md:grid-cols-2">
                    <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Need Help?
                            </h3>
                            <div className="space-y-4 text-sm text-gray-600">
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
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                What's Next?
                            </h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                {activeTab === 'volunteer' ? (
                                    <>
                                        <p>✓ Create your volunteer account</p>
                                        <p>✓ Complete your volunteer profile</p>
                                        <p>✓ Access volunteer dashboard</p>
                                        <p>✓ Help register participants</p>
                                        <p>✓ Receive training and resources</p>
                                    </>
                                ) : (
                                    <>
                                        <p>✓ Submit your registration</p>
                                        <p>✓ Wait for approval confirmation</p>
                                        <p>✓ Receive event details</p>
                                        <p>✓ Get support items</p>
                                        <p>✓ Join the celebration!</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Role-based Information */}
                {!user && activeTab === 'participant' && (
                    <div className="max-w-4xl mx-auto mt-6">
                        <Card className="bg-blue-50 border-blue-200">
                            <div className="p-6 text-center">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    Volunteer Access Required
                                </h4>
                                <p className="text-blue-800 text-sm mb-3">
                                    Participant registration requires volunteer or administrator access.
                                    Please contact a volunteer to register participants.
                                </p>
                                <p className="text-blue-700 text-sm">
                                    Want to help? <Link to="/register" onClick={() => setActiveTab('volunteer')} className="font-medium underline">Become a volunteer</Link> to access participant registration.
                                </p>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Already a volunteer message */}
                {user && (isVolunteer() || isAdmin()) && (
                    <div className="max-w-4xl mx-auto mt-6">
                        <Card className="bg-green-50 border-green-200">
                            <div className="p-6 text-center">
                                <h4 className="font-medium text-green-900 mb-2">
                                    Welcome, {isAdmin() ? 'Administrator' : 'Volunteer'}!
                                </h4>
                                <p className="text-green-800 text-sm">
                                    You can now register participants and access the admin dashboard to manage registrations.
                                </p>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Register