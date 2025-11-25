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
        <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bank Transfer Details</h2>

            <div className="space-y-6 max-w-md mx-auto">
                <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-medium text-gray-700">Account Number</span>
                        <button
                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-mono tracking-wider">
                        {bankDetails.accountNumber}
                    </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="text-lg font-medium text-gray-700 mb-3">Account Name</div>
                    <div className="text-2xl font-bold text-gray-900">{bankDetails.accountName}</div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="text-lg font-medium text-gray-700 mb-3">Bank Name</div>
                    <div className="text-2xl font-bold text-gray-900">{bankDetails.bankName}</div>
                </div>
            </div>

            {/* Important Note */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
                <p className="text-yellow-800 text-lg">
                    💡 <strong>Important:</strong> Please include <span className="font-bold text-red-600">"Love at Christmas"</span> as your transfer description/narration
                </p>
            </div>
        </div>
    );
};

export default BankDetailsCard;