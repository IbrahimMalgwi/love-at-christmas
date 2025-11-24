import React from 'react';

const DonationInstructions = () => {
    const steps = [
        {
            number: 1,
            title: 'Initiate Transfer',
            description: 'Open your mobile banking app or visit your bank'
        },
        {
            number: 2,
            title: 'Enter Details',
            description: 'Use the bank account details provided on this page'
        },
        {
            number: 3,
            title: 'Add Narration',
            description: 'Include "Love at Christmas" in the transfer description'
        },
        {
            number: 4,
            title: 'Confirm & Send',
            description: 'Review details and complete the transfer'
        },
        {
            number: 5,
            title: 'Get Confirmation',
            description: 'Keep your transaction receipt for reference'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Donate</h2>

            <div className="space-y-4">
                {steps.map((step) => (
                    <div key={step.number} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.number}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sample Deposit Slip */}
            <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Sample Deposit Slip</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-mono">1010761266</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span>Sabo Foursquare Gospel Church</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span>Zenith Bank PLC</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Narration:</span>
                        <span className="text-red-600 font-semibold">Love at Christmas</span>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-blue-800 text-sm">
                    Contact our donation team:<br />
                    📞 +234 810 465 7320<br />
                    ✉️ donations@loveatchristmas.org
                </p>
            </div>
        </div>
    );
};

export default DonationInstructions;