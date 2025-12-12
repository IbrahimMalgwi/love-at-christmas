import React, { useState } from 'react';
import { firestoreService, collections } from '../../services/firestore';
import FormInput from '../forms/FormInput';

const VolunteerForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        church: '',
        role: '',
        additional_comments: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const roleOptions = [
        { value: 'publicity', label: 'Publicity/Media' },
        { value: 'finance', label: 'Finance' },
        { value: 'aesthetics', label: 'Aesthetics/Ambiance' },
        { value: 'prayer', label: 'Prayer and Counseling' },
        { value: 'registration', label: 'Registration' },
        { value: 'security', label: 'Security' },
        { value: 'logistics', label: 'Logistics' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+234\d{10}$|^0\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Nigerian phone number';
        }

        if (!formData.church.trim()) {
            newErrors.church = 'Church/Organization is required';
        }

        if (!formData.role) {
            newErrors.role = 'Please select a role';
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
            await firestoreService.add(collections.VOLUNTEERS, formData);

            setIsSubmitted(true);
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                church: '',
                role: '',
                additional_comments: ''
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-4">
                    Your volunteer registration has been received successfully.
                </p>
                <p className="text-sm text-gray-500">
                    We'll contact you shortly with more information about your role.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Registration</h2>

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
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="your.email@example.com"
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

                <FormInput
                    label="Church/Organization"
                    name="church"
                    value={formData.church}
                    onChange={handleChange}
                    error={errors.church}
                    placeholder="Your church or organization name"
                    required
                />
            </div>

            <FormInput
                label="Preferred Role"
                type="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                options={roleOptions}
                required
            />

            <FormInput
                label="Additional Comments"
                type="textarea"
                name="additional_comments"
                value={formData.additional_comments}
                onChange={handleChange}
                error={errors.additional_comments}
                placeholder="Any special skills, availability, or comments..."
            />

            {errors.submit && (
                <div className="text-red-600 text-sm">{errors.submit}</div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? 'Submitting...' : 'Register as Volunteer'}
            </button>
        </form>
    );
};

export default VolunteerForm;