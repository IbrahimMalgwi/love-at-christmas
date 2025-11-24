import React from 'react';

const ToggleSwitch = ({ activeForm, onFormChange }) => {
    return (
        <div className="bg-gray-200 rounded-full p-1 flex">
            <button
                onClick={() => onFormChange('volunteer')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeForm === 'volunteer'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Volunteer Registration
            </button>
            <button
                onClick={() => onFormChange('participant')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeForm === 'participant'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Participant Registration
            </button>
        </div>
    );
};

export default ToggleSwitch;