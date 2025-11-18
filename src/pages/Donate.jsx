import React from 'react'
import { Landmark, Copy } from 'lucide-react'
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
            alert('Copied to clipboard!')
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Gradient */}
            <section className="bg-gradient-to-br from-red-600 to-rose-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Make a Donation
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto">
                            Your financial support helps us spread love and joy to families in need this Christmas season.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Bank Details Card */}
                <Card className="border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-3 text-lg">
                            <Landmark className="h-5 w-5 text-primary-600" />
                            Bank Transfer Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Bank Information */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Bank Name
                                        </label>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                                            <span className="font-semibold text-gray-900 text-sm">{bankDetails.bankName}</span>
                                            <button
                                                onClick={() => copyToClipboard(bankDetails.bankName)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Account Name
                                        </label>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                                            <span className="font-semibold text-gray-900 text-sm">{bankDetails.accountName}</span>
                                            <button
                                                onClick={() => copyToClipboard(bankDetails.accountName)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Account Number
                                    </label>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-300">
                                        <span className="font-bold text-gray-900 text-lg">{bankDetails.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Narration / Description
                                    </label>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                                        <span className="font-semibold text-gray-900 text-sm">{bankDetails.narration}</span>
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.narration)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-3 text-sm">Transfer Instructions</h3>
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span className="text-sm">Use the account details above for bank transfers</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span className="text-sm">
                                            Include "<strong>{bankDetails.narration}</strong>" as the transfer description
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Information */}
                            <div className="text-center border-t pt-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    For questions or assistance with your donation:
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <a
                                            href="mailto:foursquaregoseplchurchsabo@gmail.com"
                                            className="text-primary-600 hover:underline font-medium"
                                        >
                                            foursquaregoseplchurchsabo@gmail.com
                                        </a>
                                    </div>
                                    <div>
                                        <a
                                            href="tel:+2348104657320"
                                            className="text-primary-600 hover:underline font-medium"
                                        >
                                            +234 810 465 7320
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Donate