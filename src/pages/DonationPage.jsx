import React from 'react';
import BankDetailsCard from '../components/donation/BankDetailsCard';
import DonationInstructions from '../components/donation/DonationInstructions';

const DonationPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h1>
                    <p className="text-xl text-gray-600">
                        Your generous support helps us bring Christmas joy to families in need
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bank Details */}
                    <BankDetailsCard />

                    {/* Donation Instructions */}
                    <DonationInstructions />
                </div>

                {/* Additional Information */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How Your Donation Helps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🎁',
                                title: 'Gift Packages',
                                description: 'Provide essential items and Christmas gifts for children and families'
                            },
                            {
                                icon: '🍽️',
                                title: 'Christmas Meals',
                                description: 'Fund community Christmas dinners and food packages'
                            },
                            {
                                icon: '❤️',
                                title: 'Community Support',
                                description: 'Support counseling and family services during the holiday season'
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center p-4">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transparency Statement */}
                <div className="mt-8 bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Transparency Statement</h3>
                    <p className="text-red-800 text-sm">
                        We are committed to transparency in all our operations. All donations are properly
                        accounted for and used exclusively for the Love at Christmas program. Regular updates
                        and financial reports are available upon request.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DonationPage;