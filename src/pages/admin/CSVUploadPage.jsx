// src/pages/admin/CSVUploadPage.jsx
import React, { useState } from 'react';
import CSVUploader from '../admin/ItemsReceivedPage';

const CSVUploadPage = () => {
    const [recentUploads, setRecentUploads] = useState([]);

    const handleUploadComplete = (result) => {
        console.log('Upload complete:', result);

        // Add to recent uploads list
        const uploadRecord = {
            id: Date.now(),
            collection: result.collection,
            timestamp: new Date().toISOString(),
            success: result.success,
            processed: result.processed,
            total: result.totalRecords,
            errors: result.errors?.length || 0
        };

        setRecentUploads(prev => [uploadRecord, ...prev.slice(0, 4)]); // Keep last 5
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">CSV Data Import</h2>
                <div className="text-sm text-gray-500">
                    Upload CSV files to populate your database
                </div>
            </div>

            {/* CSV Uploader Component */}
            <div className="max-w-4xl">
                <CSVUploader onUploadComplete={handleUploadComplete} />
            </div>

            {/* Recent Uploads */}
            {recentUploads.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {recentUploads.map((upload) => (
                                <tr key={upload.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(upload.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {upload.collection}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {upload.processed}/{upload.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                upload.success
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {upload.success ? 'Success' : 'Failed'}
                                            </span>
                                        {upload.errors > 0 && (
                                            <span className="ml-2 text-xs text-orange-600">
                                                    ({upload.errors} errors)
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CSV Format Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">CSV Format Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-blue-800 mb-2">Required Columns by Collection:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li><strong>Volunteers:</strong> full_name, email, phone, church, role</li>
                            <li><strong>Participants:</strong> full_name, phone, address, sex, age</li>
                            <li><strong>Items Inventory:</strong> item_name, category, quantity_needed, unit_price</li>
                            <li><strong>FAQs:</strong> question, answer, category, order</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-blue-800 mb-2">Best Practices:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Use UTF-8 encoding to avoid special character issues</li>
                            <li>• Don't modify the header row column names</li>
                            <li>• For numbers, use plain format (1000, not 1,000)</li>
                            <li>• For dates, use YYYY-MM-DD format</li>
                            <li>• Maximum file size: 10MB</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CSVUploadPage;