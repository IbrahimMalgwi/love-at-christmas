// src/pages/ItemsNeededPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { supabase } from '../services/supabase';
import CategoryFilter from '../components/items/CategoryFilter';
import ItemCard from '../components/items/ItemCard';
import ProgressBar from '../components/items/ProgressBar';

const ItemsNeededPage = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const categories = [
        { value: 'all', label: 'All Items' },
        { value: 'food_items', label: 'Food Items' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'publicity', label: 'Publicity' },
        { value: 'logistics', label: 'Logistics' },
        { value: 'cloths', label: 'Cloths' },
        { value: 'ambiance', label: 'Ambiance' },
        { value: 'registration', label: 'Registration' },
        { value: 'refreshment', label: 'Refreshment' }
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    // Move filterItems inside useCallback to stabilize the function
    const filterItems = useCallback(() => {
        let filtered = items;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredItems(filtered);
    }, [items, selectedCategory, searchTerm]); // Add dependencies

    // Now include filterItems in the dependency array
    useEffect(() => {
        filterItems();
    }, [filterItems]); // Add filterItems as dependency

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('items_inventory')
                .select('*')
                .order('category')
                .order('item_name');

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Remove the old filterItems function from here

    const calculateTotals = () => {
        const totalNeeded = items.reduce((sum, item) => sum + (item.quantity_needed || 0), 0);
        const totalReceived = items.reduce((sum, item) => sum + (item.quantity_received || 0), 0);
        const totalAmountNeeded = items.reduce((sum, item) =>
            sum + ((item.quantity_needed || 0) * (item.unit_price || 0)), 0);
        const totalAmountReceived = items.reduce((sum, item) =>
            sum + ((item.quantity_received || 0) * (item.unit_price || 0)), 0);

        return {
            totalNeeded,
            totalReceived,
            totalAmountNeeded,
            totalAmountReceived,
            progress: totalNeeded > 0 ? (totalReceived / totalNeeded) * 100 : 0
        };
    };

    const totals = calculateTotals();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">Loading items...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Items Needed</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your generous donations help us bring joy to families in need.
                        Every item makes a difference.
                    </p>
                </div>

                {/* Overall Progress */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{totals.totalReceived.toLocaleString()}</div>
                            <div className="text-gray-600">Items Received</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{totals.totalNeeded.toLocaleString()}</div>
                            <div className="text-gray-600">Items Needed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">₦{totals.totalAmountReceived.toLocaleString()}</div>
                            <div className="text-gray-600">Amount Received</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">₦{totals.totalAmountNeeded.toLocaleString()}</div>
                            <div className="text-gray-600">Total Amount</div>
                        </div>
                    </div>
                    <ProgressBar progress={totals.progress} />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                        <div className="w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search items or descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No items found matching your criteria.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemsNeededPage;