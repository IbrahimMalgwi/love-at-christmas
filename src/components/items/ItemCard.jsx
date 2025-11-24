import React from 'react';
import ProgressBar from './ProgressBar';

const ItemCard = ({ item }) => {
    const quantityRemaining = item.quantity_needed - item.quantity_received;
    const progress = (item.quantity_received / item.quantity_needed) * 100;
    const valueNeeded = item.quantity_needed * item.unit_price_naira;
    const valueReceived = item.quantity_received * item.unit_price_naira;

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'clothing': return '👕';
            case 'foodstuffs': return '🍚';
            case 'household': return '🏠';
            case 'utensils': return '🍽️';
            default: return '📦';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{item.item_name}</h3>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full capitalize">
            {item.category}
          </span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quantity Needed:</span>
                        <span className="font-semibold">{item.quantity_needed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quantity Received:</span>
                        <span className="font-semibold text-green-600">{item.quantity_received.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-semibold text-red-600">{quantityRemaining.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-semibold">₦{item.unit_price_naira?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span className="text-gray-700">Total Value:</span>
                        <span>₦{valueNeeded.toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <ProgressBar progress={progress} />
                    <div className="text-xs text-gray-500 text-center mt-1">
                        {progress.toFixed(1)}% Complete
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;