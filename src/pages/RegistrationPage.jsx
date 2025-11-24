import React, { useState } from 'react';
import ToggleSwitch from '../components/registration/ToggleSwitch';
import VolunteerForm from '../components/registration/VolunteerForm';
import ParticipantForm from '../components/registration/ParticipantForm';

const RegistrationPage = () => {
    const [activeForm, setActiveForm] = useState('volunteer');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Mission</h1>
                    <p className="text-xl text-gray-600">
                        Choose how you'd like to be part of Love at Christmas
                    </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex justify-center mb-8">
                    <ToggleSwitch
                        activeForm={activeForm}
                        onFormChange={setActiveForm}
                    />
                </div>

                {/* Forms */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeForm === 'volunteer' ? (
                        <VolunteerForm />
                    ) : (
                        <ParticipantForm />
                    )}
                </div>

                {/* Additional Information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-900 mb-3">For Volunteers</h3>
                        <ul className="text-red-800 text-sm space-y-2">
                            <li>• Training and orientation provided</li>
                            <li>• Flexible scheduling options</li>
                            <li>• Certificate of participation</li>
                            <li>• Team building activities</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-3">For Participants</h3>
                        <ul className="text-green-800 text-sm space-y-2">
                            <li>• Complete confidentiality</li>
                            <li>• No cost involved</li>
                            <li>• Family-friendly environment</li>
                            <li>• Ongoing support available</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;