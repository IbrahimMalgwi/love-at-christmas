// src/pages/admin/ItemsManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ItemsManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [bulkUpdate, setBulkUpdate] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        item_name: '',
        quantity_needed: '',
        quantity_received: '0',
        unit_price: '',
        description: ''
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const categories = [
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

    // Pagination functions
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    const totalPages = () => {
        return Math.ceil(items.length / itemsPerPage);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const nextPage = () => {
        if (currentPage < totalPages()) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const PaginationControls = () => {
        const totalPagesCount = totalPages();

        if (totalPagesCount <= 1) return null;

        return (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPagesCount}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, items.length)}
                            </span>{' '}
                            of <span className="font-medium">{items.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                &larr;
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: totalPagesCount }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === page
                                            ? 'z-10 bg-red-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPagesCount}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                &rarr;
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const itemData = {
                ...formData,
                quantity_needed: parseFloat(formData.quantity_needed),
                quantity_received: parseFloat(formData.quantity_received),
                unit_price: parseFloat(formData.unit_price),
                updated_at: new Date().toISOString()
            };

            if (editingItem) {
                const { error } = await supabase
                    .from('items_inventory')
                    .update(itemData)
                    .eq('id', editingItem.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('items_inventory')
                    .insert([itemData]);

                if (error) throw error;
            }

            resetForm();
            fetchItems();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save item: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            category: '',
            item_name: '',
            quantity_needed: '',
            quantity_received: '0',
            unit_price: '',
            description: ''
        });
        setEditingItem(null);
        setShowForm(false);
        setBulkUpdate(false);
        setSelectedItems([]);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            category: item.category,
            item_name: item.item_name,
            quantity_needed: item.quantity_needed.toString(),
            quantity_received: item.quantity_received.toString(),
            unit_price: item.unit_price.toString(),
            description: item.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('items_inventory')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item: ' + error.message);
        }
    };

    const updateQuantity = async (id, field, value) => {
        try {
            const { error } = await supabase
                .from('items_inventory')
                .update({
                    [field]: value,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity: ' + error.message);
        }
    };

    const handleBulkUpdate = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to update');
            return;
        }

        const newQuantity = prompt('Enter new received quantity for selected items:');
        if (newQuantity === null) return;

        const quantity = parseFloat(newQuantity);
        if (isNaN(quantity) || quantity < 0) {
            alert('Please enter a valid number');
            return;
        }

        try {
            const { error } = await supabase
                .from('items_inventory')
                .update({
                    quantity_received: quantity,
                    updated_at: new Date().toISOString()
                })
                .in('id', selectedItems);

            if (error) throw error;

            setSelectedItems([]);
            fetchItems();
            alert(`Updated ${selectedItems.length} items successfully`);
        } catch (error) {
            console.error('Error bulk updating:', error);
            alert('Failed to update items: ' + error.message);
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const selectAllItemsOnPage = () => {
        const currentItems = getCurrentItems();
        const allSelected = currentItems.every(item => selectedItems.includes(item.id));

        if (allSelected) {
            // Deselect all on current page
            setSelectedItems(prev => prev.filter(id => !currentItems.some(item => item.id === id)));
        } else {
            // Select all on current page
            const newSelected = [...new Set([...selectedItems, ...currentItems.map(item => item.id)])];
            setSelectedItems(newSelected);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg">Loading items...</div>
            </div>
        );
    }

    const currentItems = getCurrentItems();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Items Management</h2>
                <div className="flex items-center space-x-3">
                    {/* Items per page selector */}
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <button
                        onClick={() => setBulkUpdate(!bulkUpdate)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            bulkUpdate
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                    >
                        {bulkUpdate ? 'Cancel Bulk Update' : 'Bulk Update'}
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                    >
                        Add New Item
                    </button>
                </div>
            </div>

            {/* Bulk Update Controls */}
            {bulkUpdate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900">Bulk Update Mode</h3>
                            <p className="text-blue-700 text-sm">
                                {selectedItems.length} item(s) selected on current page
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={selectAllItemsOnPage}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                {currentItems.every(item => selectedItems.includes(item.id)) ? 'Deselect Page' : 'Select Page'}
                            </button>
                            <button
                                onClick={handleBulkUpdate}
                                disabled={selectedItems.length === 0}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Update Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingItem ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Name
                            </label>
                            <input
                                type="text"
                                value={formData.item_name}
                                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity Needed
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.quantity_needed}
                                onChange={(e) => setFormData({ ...formData, quantity_needed: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit Price (₦)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.unit_price}
                                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                                min="0"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                rows="3"
                                placeholder="Optional description of the item..."
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                {editingItem ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Items Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            {bulkUpdate && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={currentItems.length > 0 && currentItems.every(item => selectedItems.includes(item.id))}
                                        onChange={selectAllItemsOnPage}
                                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Needed
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Received
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item) => {
                            const amount = item.quantity_needed * item.unit_price;
                            const progress = (item.quantity_received / item.quantity_needed) * 100;

                            return (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {bulkUpdate && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 capitalize">
                                            {item.category.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs">
                                            {item.description || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.quantity_needed}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.quantity_received}
                                            onChange={(e) => updateQuantity(item.id, 'quantity_received', parseFloat(e.target.value) || 0)}
                                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                                            min="0"
                                        />
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 text-center mt-1">
                                            {progress.toFixed(1)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₦{item.unit_price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₦{amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <PaginationControls />
            </div>

            {items.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500">No items found. Add your first item to get started.</div>
                </div>
            )}
        </div>
    );
};

export default ItemsManager;