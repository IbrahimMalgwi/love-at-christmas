// src/components/admin/CSVUploader.jsx
import React, { useState } from 'react';
import { csvService } from '../../services/csvService';
import { collections } from '../../services/firestore';

const CSVUploader = ({ onUploadComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [collectionType, setCollectionType] = useState('volunteers');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState([]);
    const [result, setResult] = useState(null);

    const collectionOptions = [
        { value: 'volunteers', label: 'Volunteers', requiredFields: ['full_name', 'email', 'phone'] },
        { value: 'participants', label: 'Participants', requiredFields: ['full_name', 'phone', 'address'] },
        { value: 'items_inventory', label: 'Items Inventory', requiredFields: ['item_name', 'category', 'quantity_needed'] },
        { value: 'faqs', label: 'FAQs', requiredFields: ['question', 'answer'] }
    ];

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setErrors(['Please select a CSV file']);
                return;
            }
            setSelectedFile(file);
            setErrors([]);
        }
    };

    const validateFile = async (csvData) => {
        const currentCollection = collectionOptions.find(opt => opt.value === collectionType);
        const validation = csvService.validateCSV(csvData, currentCollection.requiredFields);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return false;
        }
        return true;
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrors(['Please select a CSV file first']);
            return;
        }

        setUploading(true);
        setProgress(0);
        setErrors([]);
        setResult(null);

        try {
            // Step 1: Parse CSV
            const csvData = await csvService.parseCSV(selectedFile);

            // Step 2: Validate CSV structure
            const isValid = await validateFile(csvData);
            if (!isValid) {
                setUploading(false);
                return;
            }

            // Step 3: Upload to Firestore with progress tracking
            const uploadResult = await csvService.uploadCSVData(
                getFirestoreCollectionName(collectionType),
                csvData,
                (progressData) => {
                    setProgress(progressData.percentage);
                }
            );

            setResult(uploadResult);

            if (uploadResult.success) {
                onUploadComplete?.(uploadResult);
                // Reset form on success
                setSelectedFile(null);
                document.getElementById('csv-file-input').value = '';
            } else {
                setErrors([uploadResult.error || 'Upload failed']);
            }
        } catch (error) {
            setErrors([`Error processing CSV: ${error.message}`]);
        } finally {
            setUploading(false);
        }
    };

    const getFirestoreCollectionName = (type) => {
        const mapping = {
            'volunteers': collections.VOLUNTEERS,
            'participants': collections.PARTICIPANTS,
            'items_inventory': collections.ITEMS_INVENTORY,
            'faqs': collections.FAQS
        };
        return mapping[type] || type;
    };

    const downloadTemplate = () => {
        const currentCollection = collectionOptions.find(opt => opt.value === collectionType);
        if (!currentCollection) return;

        const template = csvService.generateTemplate(currentCollection.requiredFields);
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collectionType}_template.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setErrors([]);
        document.getElementById('csv-file-input').value = '';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">CSV Data Upload</h3>

            <div className="space-y-4">
                {/* Collection Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Collection
                    </label>
                    <select
                        value={collectionType}
                        onChange={(e) => setCollectionType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        {collectionOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload CSV File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            id="csv-file-input"
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />

                        {!selectedFile ? (
                            <label htmlFor="csv-file-input" className="cursor-pointer">
                                <div className="mx-auto h-12 w-12 text-gray-400">
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium text-red-600 hover:text-red-500">
                                        Click to upload
                                    </span>{' '}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    CSV files only (Max 10MB)
                                </p>
                            </label>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 text-green-500">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        type="button"
                                        className="text-red-600 hover:text-red-900"
                                        disabled={uploading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Result */}
                {result && result.success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Upload Successful!</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>{result.message}</p>
                                    {result.errors && result.errors.length > 0 && (
                                        <div className="mt-2">
                                            <p className="font-medium">Some records failed:</p>
                                            <ul className="list-disc pl-5 mt-1">
                                                {result.errors.slice(0, 3).map((err, idx) => (
                                                    <li key={idx} className="text-xs">
                                                        Row error: {err.error}
                                                    </li>
                                                ))}
                                                {result.errors.length > 3 && (
                                                    <li className="text-xs">
                                                        ...and {result.errors.length - 3} more errors
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                    <button
                        onClick={downloadTemplate}
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                        Download Template
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </div>

                {/* Instructions */}
                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">How to upload CSV:</h4>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal pl-5">
                        <li>Download the template for your selected collection</li>
                        <li>Fill in the data using Excel, Google Sheets, or any text editor</li>
                        <li>Save as CSV format (UTF-8 encoding recommended)</li>
                        <li>Select the file above and click "Upload CSV"</li>
                        <li>Records will be added to your Firebase database</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default CSVUploader;