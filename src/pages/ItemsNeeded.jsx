import React, { useState } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { calculateProgress } from '../utils/helpers'

const ItemsNeeded = () => {
    const { data: items, loading, error } = useSupabase('items_needed')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const categories = [
        { id: 'All', name: 'All Items', color: 'bg-gray-500' },
        { id: 'Clothing', name: 'Clothing', color: 'bg-blue-500' },
        { id: 'Household Items', name: 'Household Items', color: 'bg-green-500' },
        { id: 'Food Items', name: 'Food Items', color: 'bg-yellow-500' },
        { id: 'Shoes', name: 'Shoes', color: 'bg-purple-500' },
        { id: 'Financial Support', name: 'Financial', color: 'bg-red-500' },
    ]

    const filteredItems = selectedCategory === 'All'
        ? items
        : items.filter(item => item.category === selectedCategory)

    const getCategoryStats = (category) => {
        const categoryItems = items.filter(item => item.category === category)
        const totalTarget = categoryItems.reduce((sum, item) => sum + (item.target_quantity || 0), 0)
        const totalCurrent = categoryItems.reduce((sum, item) => sum + (item.current_quantity || 0), 0)
        return { totalTarget, totalCurrent }
    }

    if (loading) return <LoadingSpinner size="lg" className="min-h-screen flex items-center justify-center" />
    if (error) return <div className="text-red-600 text-center p-8">Error loading items: {error}</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Items Needed
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your donations make a real difference. Browse the items we need to spread joy this Christmas.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {categories.map((category) => {
                        const stats = getCategoryStats(category.id)

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                                }`}
                            >
                                {category.name}
                                {category.id !== 'All' && stats.totalTarget > 0 && (
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                        selectedCategory === category.id
                                            ? 'bg-white text-primary-600'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                    {Math.round(calculateProgress(stats.totalCurrent, stats.totalTarget))}%
                  </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredItems.map((item) => {
                        const progress = calculateProgress(item.current_quantity, item.target_quantity)
                        const category = categories.find(cat => cat.id === item.category)

                        return (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{item.name}</CardTitle>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                        }`}>
                      {item.priority}
                    </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${category?.color}`}></span>
                                        <span>{item.category}</span>
                                    </div>

                                    {item.target_quantity && (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-medium">
                            {item.current_quantity} / {item.target_quantity}
                          </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-right text-sm text-gray-500">
                                                    {Math.round(progress)}% Complete
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {item.description && (
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}

                                    {item.category === 'Financial Support' && (
                                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                            <p className="text-sm text-primary-700 text-center">
                                                Monetary donations help us purchase exactly what's needed
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Donation Instructions */}
                <Card className="bg-primary-50 border-primary-200">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                            How to Donate Items
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold text-primary-600">1</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Choose Items</h3>
                                <p className="text-gray-600 text-sm">
                                    Select from our needed items list above
                                </p>
                            </div>

                            <div>
                                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold text-primary-600">2</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Prepare Donation</h3>
                                <p className="text-gray-600 text-sm">
                                    Ensure items are in good condition and properly packaged
                                </p>
                            </div>

                            <div>
                                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="font-bold text-primary-600">3</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Drop Off</h3>
                                <p className="text-gray-600 text-sm">
                                    Bring items to our collection center or schedule a pickup
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ItemsNeeded