import React from 'react';
import ParticipantForm from '../components/registration/ParticipantForm';

const RegistrationPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Updated to focus only on participants */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Register for Love at Christmas</h1>
                    <p className="text-xl text-gray-600">
                        Register to receive Love at Christmas
                    </p>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Note:</span> Volunteer registration is currently closed. Only participant registration is available.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participant Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <ParticipantForm />
                </div>

                {/* Information Section */}
                {/*<div className="mt-8 bg-white rounded-lg shadow-md p-6">*/}
                {/*    <h2 className="text-2xl font-bold text-gray-900 mb-4">About Participant Registration</h2>*/}
                {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/}
                {/*        /!*<div>*!/*/}
                {/*        /!*    <h3 className="text-lg font-semibold text-gray-800 mb-2">Who Can Register</h3>*!/*/}
                {/*        /!*    <ul className="list-disc pl-5 text-gray-600 space-y-1">*!/*/}
                {/*        /!*        <li>Families in need of holiday assistance</li>*!/*/}
                {/*        /!*        <li>Individuals seeking Christmas support</li>*!/*/}
                {/*        /!*        <li>Those requiring food, gifts, or other resources</li>*!/*/}
                {/*        /!*    </ul>*!/*/}
                {/*        /!*</div>*!/*/}
                {/*        /!*<div>*!/*/}
                {/*        /!*    <h3 className="text-lg font-semibold text-gray-800 mb-2">What Happens Next</h3>*!/*/}
                {/*        /!*    <ul className="list-disc pl-5 text-gray-600 space-y-1">*!/*/}
                {/*        /!*        <li>Our team will review your application</li>*!/*/}
                {/*        /!*        <li>You'll receive confirmation within 3-5 business days</li>*!/*/}
                {/*        /!*        <li>We'll contact you with next steps</li>*!/*/}
                {/*        /!*    </ul>*!/*/}
                {/*        /!*</div>*!/*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default RegistrationPage;