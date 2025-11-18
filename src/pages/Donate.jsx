// src/pages/Donate.js
import React from 'react'
import { Landmark, Copy, } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'

const Donate = () => {
    const bankDetails = {
        bankName: 'Zenith Bank PLC',
        accountName: 'Sabo Foursquare Gospel Church',
        accountNumber: '1010761266',
        narration: 'Love AT Christmas'
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            // You could add a toast notification here for better UX
            alert('Copied to clipboard!')
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Make a Donation
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your financial support helps us spread love and joy to families in need this Christmas season.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Bank Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Landmark className="h-6 w-6 text-primary-600" />
                                    Bank Transfer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Bank Information */}
                                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                    Bank Name
                                                </label>
                                                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                                                    <span className="font-semibold text-gray-900">{bankDetails.bankName}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(bankDetails.bankName)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Copy to clipboard"
                                                    >
                                                        <Copy className="h-4 w-4 text-gray-500" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                    Account Name
                                                </label>
                                                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                                                    <span className="font-semibold text-gray-900">{bankDetails.accountName}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(bankDetails.accountName)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Copy to clipboard"
                                                    >
                                                        <Copy className="h-4 w-4 text-gray-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Account Number
                                            </label>
                                            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                                                <span className="font-semibold text-gray-900 text-lg">{bankDetails.accountNumber}</span>
                                                <button
                                                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Narration / Description
                                            </label>
                                            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                                                <span className="font-semibold text-gray-900">{bankDetails.narration}</span>
                                                <button
                                                    onClick={() => copyToClipboard(bankDetails.narration)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-blue-900 mb-2">Transfer Instructions</h3>
                                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                            <li>Use the account details above for bank transfers</li>
                                            <li>Include "<strong>{bankDetails.narration}</strong>" as the transfer description</li>
                                            <li>Transfers are processed within 24 hours</li>
                                            <li>You will receive a confirmation email once processed</li>
                                        </ul>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="text-center text-gray-600">
                                        <p className="text-sm">
                                            For international transfers or any questions, please contact us at{' '}
                                            <a href="mailto:finance@loveatchristmas.org" className="text-primary-600 hover:underline">
                                                finance@loveatchristmas.org
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Impact & Security Sidebar */}
                    <div className="space-y-6">
                        {/* Impact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-3 rounded-lg border border-gray-200">
                                        <div className="font-semibold text-gray-900">Every Donation Helps</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Your contribution directly supports families in need during the Christmas season.
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200">
                                        <div className="font-semibold text-gray-900">100% Transparent</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            We provide regular updates on how donations are being used in our community.
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Transparency */}
                        {/*<Card className="bg-primary-50 border-primary-200">*/}
                        {/*    <CardContent className="p-6">*/}
                        {/*        <div className="text-center">*/}
                        {/*            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />*/}
                        {/*            <h3 className="font-semibold text-gray-900 mb-2">Secure & Accountable</h3>*/}
                        {/*            <p className="text-sm text-gray-600 mb-4">*/}
                        {/*                Your donations are handled with the highest level of security and transparency.*/}
                        {/*            </p>*/}
                        {/*            <div className="space-y-2 text-sm text-gray-600">*/}
                        {/*                <div className="flex justify-between">*/}
                        {/*                    <span>Direct Support</span>*/}
                        {/*                    <span className="font-semibold">85%</span>*/}
                        {/*                </div>*/}
                        {/*                <div className="flex justify-between">*/}
                        {/*                    <span>Program Operations</span>*/}
                        {/*                    <span className="font-semibold">10%</span>*/}
                        {/*                </div>*/}
                        {/*                <div className="flex justify-between">*/}
                        {/*                    <span>Administrative</span>*/}
                        {/*                    <span className="font-semibold">5%</span>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </CardContent>*/}
                        {/*</Card>*/}

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="font-semibold text-gray-900">Email</div>
                                        <a href="mailto:donations@loveatchristmas.org" className="text-primary-600 hover:underline">
                                            donations@loveatchristmas.org
                                        </a>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Phone</div>
                                        <a href="tel:+1234567890" className="text-primary-600 hover:underline">
                                            +1 (234) 567-890
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Donate