import React, { useState } from 'react';

const BankDetailsCard = () => {
    const [copied, setCopied] = useState(false);

    const bankDetails = {
        accountNumber: '1010761266',
        accountName: 'Sabo Foursquare Gospel Church',
        bankName: 'Zenith Bank PLC'
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bank Transfer Details</h2>

            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500">Account Number</span>
                        <button
                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="text-xl font-bold text-gray-900 font-mono">
                        {bankDetails.accountNumber}
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Account Name</div>
                    <div className="text-xl font-bold text-gray-900">{bankDetails.accountName}</div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Bank Name</div>
                    <div className="text-xl font-bold text-gray-900">{bankDetails.bankName}</div>
                </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-gray-500 mb-2">QR Code for Quick Transfer</div>
                <div className="bg-gray-100 h-48 flex items-center justify-center rounded">
                    <span className="text-gray-400">QR Code Image</span>
                </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm text-center">
                    💡 <strong>Important:</strong> Always include "Love at Christmas" as your transfer narration
                </p>
            </div>
        </div>
    );
};

export default BankDetailsCard;