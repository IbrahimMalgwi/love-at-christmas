import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSupabase } from '../hooks/useSupabase'
import {
    Users,
    Heart,
    Gift,
    DollarSign,
    Download,
    Calendar,
    BarChart3,
    Package,
    Plus,
    Edit,
    Trash2,
    TrendingUp,
    TrendingDown
} from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import VolunteerChart from '../components/dashboard/VolunteerChart'
import ParticipantTable from '../components/dashboard/ParticipantTable'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ItemManagement from '../components/dashboard/ItemManagement'

const AdminDashboard = () => {
    const { user, profile, isAdmin } = useAuth()
    const { data: participants, loading: participantsLoading } = useSupabase('participants')
    const { data: volunteers, loading: volunteersLoading } = useSupabase('volunteers')
    const { data: items, loading: itemsLoading, refetch: refetchItems } = useSupabase('items_needed')
    const { data: donations, loading: donationsLoading } = useSupabase('donations')

    const [activeView, setActiveView] = useState('overview')
    const [exportLoading, setExportLoading] = useState(false)
    const [stats, setStats] = useState([])

    // Calculate real-time statistics
    useEffect(() => {
        if (participants && volunteers && items && donations) {
            const totalParticipants = participants.length
            const totalVolunteers = volunteers.length
            const totalItems = items.reduce((sum, item) => sum + (item.current_quantity || 0), 0)
            const totalDonations = donations.reduce((sum, donation) => sum + (parseFloat(donation.amount) || 0), 0)

            // Calculate progress for all items
            const totalTarget = items.reduce((sum, item) => sum + (item.target_quantity || 0), 0)
            const overallProgress = totalTarget > 0 ? Math.round((totalItems / totalTarget) * 100) : 0

            // Calculate trends (you can replace with real data)
            const participantTrend = totalParticipants > 50 ? 'positive' : 'neutral'
            const volunteerTrend = totalVolunteers > 20 ? 'positive' : 'neutral'
            const itemsTrend = overallProgress > 30 ? 'positive' : 'neutral'
            const donationsTrend = totalDonations > 50000 ? 'positive' : 'neutral'

            const newStats = [
                {
                    title: 'Total Participants',
                    value: totalParticipants.toLocaleString(),
                    change: participantTrend === 'positive' ? '+12%' : '+5%',
                    changeType: participantTrend,
                    icon: Users,
                    description: 'Registered for 2025 event'
                },
                {
                    title: 'Active Volunteers',
                    value: totalVolunteers.toLocaleString(),
                    change: volunteerTrend === 'positive' ? '+8%' : '+3%',
                    changeType: volunteerTrend,
                    icon: Heart,
                    description: 'Across all roles'
                },
                {
                    title: 'Items Collected',
                    value: totalItems.toLocaleString(),
                    change: itemsTrend === 'positive' ? '+15%' : '+8%',
                    changeType: itemsTrend,
                    icon: Gift,
                    description: `${overallProgress}% of target`
                },
                {
                    title: 'Donations Received',
                    value: `₦${totalDonations.toLocaleString()}`,
                    change: donationsTrend === 'positive' ? '+22%' : '+10%',
                    changeType: donationsTrend,
                    icon: DollarSign,
                    description: 'Financial support'
                }
            ]

            setStats(newStats)
        }
    }, [participants, volunteers, items, donations])

    const handleExport = async (type) => {
        setExportLoading(true)
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000))

            // In a real app, you would generate and download CSV/Excel files
            let data = []
            switch (type) {
                case 'participants':
                    data = participants
                    break
                case 'volunteers':
                    data = volunteers
                    break
                case 'donations':
                    data = donations
                    break
                case 'items':
                    data = items
                    break
                default:
                    data = []
            }

            // Create CSV content (simplified)
            const csvContent = "data:text/csv;charset=utf-8,"
                + data.map(row => Object.values(row).join(',')).join('\n')

            const encodedUri = encodeURI(csvContent)
            const link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", `${type}_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        } catch (error) {
            console.error('Export failed:', error)
            alert('Export failed. Please try again.')
        } finally {
            setExportLoading(false)
        }
    }

    const loading = participantsLoading || volunteersLoading || itemsLoading || donationsLoading

    if (!isAdmin()) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md text-center">
                    <CardContent className="p-8">
                        <div className="text-red-600 mb-4">
                            <BarChart3 className="h-12 w-12 mx-auto" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600">
                            You don't have permission to access the admin dashboard.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (loading) {
        return <LoadingSpinner size="lg" className="min-h-screen flex items-center justify-center" />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">
                                Welcome back, {profile?.full_name || user?.email} • Love At Christmas 2025 Analytics
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                loading={exportLoading}
                                onClick={() => handleExport('all')}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export All Data
                            </Button>
                            <Button size="sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
                    {[
                        { id: 'overview', name: 'Overview', icon: BarChart3 },
                        { id: 'items', name: 'Items Management', icon: Package },
                        { id: 'participants', name: 'Participants', icon: Users },
                        { id: 'volunteers', name: 'Volunteers', icon: Heart },
                        { id: 'donations', name: 'Donations', icon: DollarSign }
                    ].map(tab => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                                    activeView === tab.id
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {tab.name}
                            </button>
                        )
                    })}
                </div>

                {/* Overview View */}
                {activeView === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <StatsCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Quick Insights */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Items Progress */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Items Collection Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {items && items.slice(0, 5).map((item) => {
                                            const progress = item.target_quantity > 0
                                                ? Math.round((item.current_quantity / item.target_quantity) * 100)
                                                : 0
                                            return (
                                                <div key={item.id} className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-medium text-gray-900">{item.name}</span>
                                                            <span className="text-gray-600">{progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    progress > 70 ? 'bg-green-500' :
                                                                        progress > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {item.current_quantity} / {item.target_quantity} {item.unit}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center">
                                                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                                                <span className="text-sm font-medium text-green-800">
                                                    5 new participants registered
                                                </span>
                                            </div>
                                            <span className="text-xs text-green-600">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center">
                                                <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    ₦25,000 donation received
                                                </span>
                                            </div>
                                            <span className="text-xs text-blue-600">5 hours ago</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                            <div className="flex items-center">
                                                <Gift className="h-4 w-4 text-yellow-600 mr-2" />
                                                <span className="text-sm font-medium text-yellow-800">
                                                    50 bags of rice donated
                                                </span>
                                            </div>
                                            <span className="text-xs text-yellow-600">1 day ago</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <VolunteerChart data={volunteers} />

                            {/* Items by Category */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Items by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {items && Array.from(new Set(items.map(item => item.category))).map(category => {
                                            const categoryItems = items.filter(item => item.category === category)
                                            const totalCollected = categoryItems.reduce((sum, item) => sum + item.current_quantity, 0)
                                            const totalTarget = categoryItems.reduce((sum, item) => sum + item.target_quantity, 0)
                                            const progress = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0

                                            return (
                                                <div key={category} className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-900">{category}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    progress > 70 ? 'bg-green-500' :
                                                                        progress > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-gray-600 w-8">{progress}%</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Items Management View */}
                {activeView === 'items' && (
                    <ItemManagement
                        items={items}
                        onItemsUpdate={refetchItems}
                    />
                )}

                {/* Participants View */}
                {activeView === 'participants' && (
                    <div>
                        <ParticipantTable
                            data={participants}
                            onExport={() => handleExport('participants')}
                        />
                    </div>
                )}

                {/* Volunteers View */}
                {activeView === 'volunteers' && (
                    <div className="space-y-8">
                        <VolunteerChart data={volunteers} />

                        {/* Volunteers Table would go here */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Volunteer Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    Volunteer management table component
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Donations View */}
                {activeView === 'donations' && (
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Donation Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    <DollarSign className="h-12 w-12" />
                                    <span className="ml-2">Donation analytics charts</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Donations Table would go here */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Donation Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    Donation records table component
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard