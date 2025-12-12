import React, { useState, useEffect } from 'react';
import { firestoreService, collections } from '../../services/firestore';

const StatsCounter = () => {
    const [stats, setStats] = useState({
        itemsCollected: 0,
        volunteers: 0,
        participants: 0,
        familiesHelped: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Use Firebase Firestore to fetch data from all three collections
            const [itemsData, volunteersData, participantsData] = await Promise.all([
                firestoreService.getAll(collections.ITEMS_INVENTORY),
                firestoreService.getAll(collections.VOLUNTEERS),
                firestoreService.getAll(collections.PARTICIPANTS)
            ]);

            // Calculate total items received from Firestore data
            const totalItems = itemsData.reduce((sum, item) => sum + (item.quantity_received || 0), 0);

            setStats({
                itemsCollected: totalItems,
                volunteers: volunteersData?.length || 0,
                participants: participantsData?.length || 0,
                familiesHelped: Math.floor((participantsData?.length || 0) / 4) // Estimate families helped
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const statsData = [
        {
            label: 'Items Collected',
            value: stats.itemsCollected,
            icon: '📦'
        },
        {
            label: 'Volunteers Registered',
            value: stats.volunteers,
            icon: '👥'
        },
        {
            label: 'Participants Helped',
            value: stats.participants,
            icon: '❤️'
        },
        {
            label: 'Families Supported',
            value: stats.familiesHelped,
            icon: '🏠'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Our Impact So Far
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statsData.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl mb-4">{stat.icon}</div>
                            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                                {stat.value.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;