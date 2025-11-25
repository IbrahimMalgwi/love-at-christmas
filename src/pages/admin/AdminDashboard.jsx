// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ItemsManager from './ItemsManager';
import RegistrationsManager from './RegistrationsManager';
import FAQManager from './FAQManager';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('items');
    const { admin, signOut } = useAuth();

    const tabs = [
        { id: 'items', name: 'Items Management', icon: '📦' },
        { id: 'registrations', name: 'Registrations', icon: '👥' },
        { id: 'faqs', name: 'FAQs', icon: '❓' }
    ];

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            {/*<div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">*/}
                            {/*    ❤️*/}
                            {/*</div>*/}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Love at Christmas Program</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{admin?.full_name}</p>
                                <p className="text-sm text-gray-500">{admin?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'items' && <ItemsManager />}
                {activeTab === 'registrations' && <RegistrationsManager />}
                {activeTab === 'faqs' && <FAQManager />}
            </main>
        </div>
    );
};

export default AdminDashboard;