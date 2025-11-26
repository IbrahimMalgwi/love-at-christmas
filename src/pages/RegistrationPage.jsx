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
            </div>
        </div>
    );
};

export default RegistrationPage;