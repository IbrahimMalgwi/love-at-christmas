import React, { useState } from 'react';
import { firestoreService, collections } from '../../services/firestore';
import FormInput from '../forms/FormInput';

const ParticipantForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
        sex: '',
        age: '',
        religion: '',
        special_needs: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const sexOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+234\d{10}$|^0\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Nigerian phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.sex) {
            newErrors.sex = 'Please select your sex';
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (formData.age < 0 || formData.age > 120) {
            newErrors.age = 'Please enter a valid age';
        }

        if (!formData.religion.trim()) {
            newErrors.religion = 'Religion is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await firestoreService.add(collections.PARTICIPANTS, {
                ...formData,
                age: parseInt(formData.age)
            });

            setIsSubmitted(true);
            setFormData({
                full_name: '',
                phone: '',
                address: '',
                sex: '',
                age: '',
                religion: '',
                special_needs: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: 'Failed to submit form. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-8">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                <p className="text-gray-600 mb-4">
                    Thank you for registering as a participant in Love at Christmas.
                </p>
                <p className="text-sm text-gray-500">
                    We'll contact you with details about the event and how to receive your Christmas package.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Participant Registration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    error={errors.full_name}
                    placeholder="Enter your full name"
                    required
                />

                <FormInput
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="e.g., 08012345678 or +2348012345678"
                    required
                />
            </div>

            <FormInput
                label="Full Address"
                type="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Enter your complete residential address"
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Sex"
                    type="radio-group"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    error={errors.sex}
                    options={sexOptions}
                    required
                />

                <FormInput
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    error={errors.age}
                    placeholder="Enter your age"
                    min="0"
                    max="120"
                    required
                />
            </div>

            <FormInput
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                error={errors.religion}
                placeholder="e.g., Christianity, Islam, Traditional, etc."
                required
            />

            <FormInput
                label="Special Needs (Optional)"
                type="textarea"
                name="special_needs"
                value={formData.special_needs}
                onChange={handleChange}
                error={errors.special_needs}
                placeholder="Any special requirements, medical conditions, or specific needs we should know about..."
            />

            {errors.submit && (
                <div className="text-red-600 text-sm">{errors.submit}</div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? 'Submitting...' : 'Register as Participant'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> All information provided is kept confidential and used solely
                    for the purpose of the Love at Christmas program. We respect your privacy and
                    are committed to protecting your personal information.
                </p>
            </div>
        </form>
    );
};

export default ParticipantForm;