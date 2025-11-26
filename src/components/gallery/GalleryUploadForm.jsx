import React, { useState, useEffect } from 'react';
import FormInput from '../forms/FormInput';
import FileUpload from './FileUpload';
// Remove the unused FileUploadService import

const GalleryUploadForm = ({ onSubmit, onCancel, categories, initialData = {} }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        image_url: initialData.image_url || '',
        file_name: initialData.file_name || '',
        file_size: initialData.file_size || '',
        mime_type: initialData.mime_type || '',
        storage_path: initialData.storage_path || '',
        ...initialData
    });

    const [uploadData, setUploadData] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (uploadData) {
            setFormData(prev => ({
                ...prev,
                image_url: uploadData.image_url || '',
                file_name: uploadData.file_name || '',
                file_size: uploadData.file_size || '',
                mime_type: uploadData.mime_type || '',
                storage_path: uploadData.storage_path || ''
            }));
        }
    }, [uploadData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.category_id) {
            newErrors.category_id = 'Category is required';
        }

        if (!formData.image_url && !uploadData) {
            newErrors.image = 'Please upload an image';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Prepare final data
        const submitData = { ...formData };

        // If we have new upload data, use it
        if (uploadData) {
            Object.assign(submitData, uploadData);
        }

        onSubmit(submitData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleUploadSuccess = (data) => {
        setUploadData(data);
        setErrors(prev => ({ ...prev, image: '' }));
    };

    const handleUploadError = (error) => {
        setErrors(prev => ({ ...prev, image: error }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">
                {initialData.id ? 'Edit Image' : 'Upload New Image'}
            </h2>

            <div className="space-y-6">
                {/* File Upload Section */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-3">
                        Image Upload *
                    </label>
                    <FileUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        existingFile={initialData.image_url}
                    />
                    {errors.image && (
                        <p className="text-red-600 text-sm mt-2">{errors.image}</p>
                    )}
                </div>

                {/* Form Fields */}
                <FormInput
                    label="Title *"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    required
                />

                <FormInput
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                />

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category_id}
                        onChange={(e) => handleChange('category_id', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.category_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.image_url && !uploadData}
                >
                    {initialData.id ? 'Update Image' : 'Upload Image'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default GalleryUploadForm;