import React, { useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card'
import Button from '../common/Button'
import { Plus, Edit, Trash2, Save, X, Package } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

const ItemManagement = ({ items, onItemsUpdate }) => {
    const { addNotification } = useNotifications()
    const [editingItem, setEditingItem] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: 'Food Items',
        description: '',
        target_quantity: 0,
        current_quantity: 0,
        priority: 'Medium',
        unit: 'pieces'
    })

    const categories = ['Food Items', 'Clothing', 'Electronics', 'Utensils', 'Shoes', 'Financial Support']
    const priorities = ['Low', 'Medium', 'High', 'Urgent']
    const units = ['pieces', 'bags', 'packs', 'tins', 'bottles', 'units', 'sets', 'pairs', 'naira']

    const handleEdit = (item) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            category: item.category,
            description: item.description || '',
            target_quantity: item.target_quantity,
            current_quantity: item.current_quantity,
            priority: item.priority,
            unit: item.unit
        })
        setShowAddForm(false)
    }

    const handleCancel = () => {
        setEditingItem(null)
        setShowAddForm(false)
        setFormData({
            name: '',
            category: 'Food Items',
            description: '',
            target_quantity: 0,
            current_quantity: 0,
            priority: 'Medium',
            unit: 'pieces'
        })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            if (editingItem) {
                // Update existing item
                const { error } = await supabase
                    .from('items_needed')
                    .update(formData)
                    .eq('id', editingItem.id)

                if (error) throw error
                addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Item updated successfully!'
                })
            } else {
                // Add new item
                const { error } = await supabase
                    .from('items_needed')
                    .insert([formData])

                if (error) throw error
                addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Item added successfully!'
                })
            }

            onItemsUpdate()
            handleCancel()
        } catch (error) {
            console.error('Error saving item:', error)
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to save item. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (item) => {
        if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('items_needed')
                .delete()
                .eq('id', item.id)

            if (error) throw error

            addNotification({
                type: 'success',
                title: 'Success',
                message: 'Item deleted successfully!'
            })
            onItemsUpdate()
        } catch (error) {
            console.error('Error deleting item:', error)
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to delete item. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (item, newQuantity) => {
        try {
            const { error } = await supabase
                .from('items_needed')
                .update({ current_quantity: newQuantity })
                .eq('id', item.id)

            if (error) throw error

            addNotification({
                type: 'success',
                title: 'Updated',
                message: `Quantity updated for ${item.name}`
            })
            onItemsUpdate()
        } catch (error) {
            console.error('Error updating quantity:', error)
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to update quantity'
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Items Management</h2>
                    <p className="text-gray-600">Manage donation items and track progress</p>
                </div>
                <Button
                    onClick={() => {
                        setShowAddForm(true)
                        setEditingItem(null)
                        setFormData({
                            name: '',
                            category: 'Food Items',
                            description: '',
                            target_quantity: 0,
                            current_quantity: 0,
                            priority: 'Medium',
                            unit: 'pieces'
                        })
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                </Button>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingItem) && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter item name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={formData.target_quantity}
                                    onChange={(e) => setFormData({ ...formData, target_quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Quantity
                                </label>
                                <input
                                    type="number"
                                    value={formData.current_quantity}
                                    onChange={(e) => setFormData({ ...formData, current_quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    {priorities.map(priority => (
                                        <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    {units.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter item description (optional)"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <Button variant="outline" onClick={handleCancel} disabled={loading}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} loading={loading}>
                                <Save className="h-4 w-4 mr-2" />
                                {editingItem ? 'Update Item' : 'Add Item'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Items List */}
            <div className="grid gap-6">
                {items && items.map((item) => {
                    const progress = item.target_quantity > 0
                        ? Math.round((item.current_quantity / item.target_quantity) * 100)
                        : 0

                    return (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        {item.category}
                                                    </span>
                                                    <span>Priority: <strong>{item.priority}</strong></span>
                                                    <span>Unit: <strong>{item.unit}</strong></span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {item.description && (
                                            <p className="text-gray-600 mb-4">{item.description}</p>
                                        )}

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium">
                                                    {item.current_quantity} / {item.target_quantity} {item.unit}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-500 ${
                                                        progress > 70 ? 'bg-green-500' :
                                                            progress > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>{progress}% Complete</span>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item, Math.max(0, item.current_quantity - 1))}
                                                    >
                                                        -1
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item, item.current_quantity + 1)}
                                                    >
                                                        +1
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {(!items || items.length === 0) && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first donation item.</p>
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Item
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default ItemManagement