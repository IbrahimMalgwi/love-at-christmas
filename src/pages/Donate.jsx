// src/pages/Donate
import React, { useState } from 'react'
import { CreditCard, Landmark, QrCode, Shield, Gift, Heart } from 'lucide-react'
// Replace Bank with Landmark which is the correct icon for bank
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Button from '../components/common/Button'

const Donate = () => {
    const [donationAmount, setDonationAmount] = useState('')
    const [selectedMethod, setSelectedMethod] = useState('bank')

    const presetAmounts = [25, 50, 100, 250, 500]

    const paymentMethods = [
        {
            id: 'bank',
            name: 'Bank Transfer',
            icon: Landmark, // Changed from Bank to Landmark
            description: 'Direct bank transfer to our account',
            details: {
                bankName: 'Unity Trust Bank',
                accountName: 'Love At Christmas Foundation',
                accountNumber: '1234567890',
                routingNumber: '021000021'
            }
        },
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: CreditCard,
            description: 'Secure online payment',
            details: {
                supported: 'Visa, MasterCard, American Express',
                security: 'PCI DSS Compliant'
            }
        },
        {
            id: 'qr',
            name: 'QR Code Payment',
            icon: QrCode,
            description: 'Scan to pay instantly',
            details: {
                apps: 'Venmo, PayPal, Cash App',
                instruction: 'Scan the QR code with your payment app'
            }
        }
    ]

    const impactLevels = [
        { amount: 25, impact: 'Provides a Christmas meal for one family' },
        { amount: 50, impact: 'Buys warm clothing for two children' },
        { amount: 100, impact: 'Supports gift packages for three families' },
        { amount: 250, impact: 'Funds educational materials for a month' },
        { amount: 500, impact: 'Sponsors an entire family for Christmas' }
    ]

    const selectedMethodData = paymentMethods.find(method => method.id === selectedMethod)

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {/* Donation Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Amount Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Donation Amount</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Preset Amounts */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {presetAmounts.map(amount => (
                                            <button
                                                key={amount}
                                                onClick={() => setDonationAmount(amount.toString())}
                                                className={`p-4 rounded-lg border-2 text-center font-semibold transition-all ${
                                                    donationAmount === amount.toString()
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                                                }`}
                                            >
                                                ${amount}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Or enter custom amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                value={donationAmount}
                                                onChange={(e) => setDonationAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {paymentMethods.map(method => {
                                        const Icon = method.icon
                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedMethod(method.id)}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                    selectedMethod === method.id
                                                        ? 'border-primary-600 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-2 rounded-lg ${
                                                        selectedMethod === method.id ? 'bg-primary-600' : 'bg-gray-100'
                                                    }`}>
                                                        <Icon className={`h-6 w-6 ${
                                                            selectedMethod === method.id ? 'text-white' : 'text-gray-600'
                                                        }`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                                        <p className="text-sm text-gray-600">{method.description}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 ${
                                                        selectedMethod === method.id
                                                            ? 'border-primary-600 bg-primary-600'
                                                            : 'border-gray-300'
                                                    }`}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Details */}
                        {selectedMethodData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{selectedMethodData.name} Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedMethod.id === 'bank' && (
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Bank Name:</span>
                                                        <span className="font-semibold">{selectedMethodData.details.bankName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Account Name:</span>
                                                        <span className="font-semibold">{selectedMethodData.details.accountName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Account Number:</span>
                                                        <span className="font-semibold">{selectedMethodData.details.accountNumber}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Routing Number:</span>
                                                        <span className="font-semibold">{selectedMethodData.details.routingNumber}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Please include your name as reference when making the transfer.
                                            </p>
                                        </div>
                                    )}

                                    {selectedMethod.id === 'card' && (
                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="1234 5678 9012 3456"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Name on Card
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Shield className="h-4 w-4 text-green-500" />
                                                <span>Your payment is secure and encrypted</span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedMethod.id === 'qr' && (
                                        <div className="text-center space-y-4">
                                            <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                                                <QrCode className="h-32 w-32 text-gray-400 mx-auto" />
                                                <p className="text-sm text-gray-500 mt-2">QR Code Display</p>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Scan this QR code with your preferred payment app to complete your donation.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Donate Button */}
                        <Button size="lg" className="w-full" disabled={!donationAmount}>
                            <div className="flex items-center justify-center">
                                <Heart className="h-5 w-5 mr-2" />
                                Donate ${donationAmount || '0'}
                            </div>
                        </Button>
                    </div>

                    {/* Impact Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {impactLevels.map(level => (
                                        <div
                                            key={level.amount}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                donationAmount === level.amount.toString()
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Gift className="h-5 w-5 text-primary-600" />
                                                <div>
                                                    <div className="font-semibold text-gray-900">${level.amount}</div>
                                                    <div className="text-sm text-gray-600">{level.impact}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary-50 border-primary-200">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Secure & Transparent</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Every dollar is accounted for and directly supports our programs.
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Program Expenses</span>
                                            <span className="font-semibold">85%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Administrative</span>
                                            <span className="font-semibold">10%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Fundraising</span>
                                            <span className="font-semibold">5%</span>
                                        </div>
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