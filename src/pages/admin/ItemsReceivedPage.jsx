// src/pages/admin/ItemsReceivedPage.jsx
import React, { useState, useEffect } from 'react';
import { firestoreService, collections } from '../../services/firestore';

const ItemsReceivedPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await firestoreService.getAll(collections.ITEMS_RECEIVED);
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading items...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Items Received</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Received</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.item_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(item.received_date?.toDate()).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.donor_name || 'Anonymous'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No items received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemsReceivedPage;