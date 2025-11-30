import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

const ItemsReceivedPage = () => {
    const [formData, setFormData] = useState({
        item_name: '',
        quantity: 1,
        description: ''
    });
    const [receivedItems, setReceivedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { admin } = useAuth();

    useEffect(() => {
        fetchReceivedItems();
    }, []);

    const fetchReceivedItems = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('items_received')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReceivedItems(data || []);
        } catch (error) {
            console.error('Error fetching received items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');

        try {
            const { error } = await supabase
                .from('items_received')
                .insert([{
                    ...formData,
                    received_by: admin?.id
                }]);

            if (error) throw error;

            setSuccessMessage('Item received successfully recorded!');
            setFormData({
                item_name: '',
                quantity: 1,
                description: ''
            });

            // Refresh the list
            fetchReceivedItems();
        } catch (error) {
            console.error('Error submitting received item:', error);
            setSuccessMessage('Error recording item. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 1 : value
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Items Received</h1>
                    <p className="text-xl text-gray-600">
                        Record items that have been received for the Love at Christmas program
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Record New Item</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="item_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    id="item_name"
                                    name="item_name"
                                    value={formData.item_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter item name"
                                />
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Additional details about the item..."
                                />
                            </div>

                            {successMessage && (
                                <div className={`p-3 rounded-md ${
                                    successMessage.includes('Error')
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-green-50 text-green-700'
                                }`}>
                                    {successMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Recording Item...' : 'Record Received Item'}
                            </button>
                        </form>
                    </div>

                    {/* Items List Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Received Items</h2>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading items...</p>
                            </div>
                        ) : receivedItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No items received yet. Start by recording your first item!
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {receivedItems.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-900 text-lg">{item.item_name}</h3>
                                            <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                                                {item.quantity} {item.quantity === 1 ? 'unit' : 'units'}
                                            </span>
                                        </div>

                                        {item.description && (
                                            <p className="text-gray-600 mb-2">{item.description}</p>
                                        )}

                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>Received on {formatDate(item.received_date || item.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Statistics */}
                {receivedItems.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{receivedItems.length}</div>
                                <div className="text-gray-600">Total Items Recorded</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {receivedItems.reduce((sum, item) => sum + item.quantity, 0)}
                                </div>
                                <div className="text-gray-600">Total Quantity</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {new Set(receivedItems.map(item => item.item_name)).size}
                                </div>
                                <div className="text-gray-600">Unique Items</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemsReceivedPage;