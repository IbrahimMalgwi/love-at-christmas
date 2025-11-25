import React from 'react';
import BankDetailsCard from '../components/donation/BankDetailsCard';

const DonationPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your generous support helps us bring Christmas joy and essential items to families in need this holiday season
                    </p>
                </div>

                {/* Bank Details */}
                <BankDetailsCard />


                {/* Transparency Statement */}
                <div className="mt-8 bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 text-center">Transparency Statement</h3>
                    <p className="text-red-800 text-center">
                        We are committed to transparency in all our operations. All donations are properly
                        accounted for and used exclusively for the Love at Christmas program.
                        Every contribution makes a direct impact in bringing joy to families during the holiday season.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DonationPage;