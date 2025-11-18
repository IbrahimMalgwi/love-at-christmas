import React, { useState } from 'react'
// import { useAuth } from '../hooks/useAuth'
import { useSupabase } from '../hooks/useSupabase'
import {
    Users,
    Heart,
    Gift,
    DollarSign,
    Download,
    Calendar,
    BarChart3
} from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import VolunteerChart from '../components/dashboard/VolunteerChart'
import ParticipantTable from '../components/dashboard/ParticipantTable'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Button from '../components/common/Button'

const AdminDashboard = () => {
    // const { user } = useAuth()
    const { data: participants } = useSupabase('participants')
    const { data: volunteers } = useSupabase('volunteers')
    const { data: items } = useSupabase('items_needed')
    const { data: donations } = useSupabase('donations')

    const [activeView, setActiveView] = useState('overview')
    const [exportLoading, setExportLoading] = useState(false)

    // Calculate stats
    const totalParticipants = participants?.length || 0
    const totalVolunteers = volunteers?.length || 0
    const totalItems = items?.reduce((sum, item) => sum + (item.current_quantity || 0), 0) || 0
    const totalDonations = donations?.reduce((sum, donation) => sum + (parseFloat(donation.amount) || 0), 0) || 0

    const stats = [
        {
            title: 'Total Participants',
            value: totalParticipants.toLocaleString(),
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            description: 'Registered for 2025 event'
        },
        {
            title: 'Active Volunteers',
            value: totalVolunteers.toLocaleString(),
            change: '+8%',
            changeType: 'positive',
            icon: Heart,
            description: 'Across all roles'
        },
        {
            title: 'Items Collected',
            value: totalItems.toLocaleString(),
            change: '+15%',
            changeType: 'positive',
            icon: Gift,
            description: 'Towards our goal'
        },
        {
            title: 'Donations Received',
            value: `$${totalDonations.toLocaleString()}`,
            change: '+22%',
            changeType: 'positive',
            icon: DollarSign,
            description: 'Financial support'
        }
    ]

    const handleExport = async (type) => {
        setExportLoading(true)
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000))

            // In a real app, you would generate and download CSV/Excel files
            console.log(`Exporting ${type} data...`)
            alert(`${type} data exported successfully!`)
        } catch (error) {
            console.error('Export failed:', error)
            alert('Export failed. Please try again.')
        } finally {
            setExportLoading(false)
        }
    }

    // Check if user is admin (you'll need to implement proper admin check)
    const isAdmin = true // Replace with actual admin check

    if (!isAdmin) {
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Love At Christmas 2025 Analytics</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button variant="outline" size="sm" loading={exportLoading}>
                                <Download className="h-4 w-4 mr-2" />
                                Export Report
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

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <VolunteerChart data={volunteers} />

                            {/* Additional Chart Placeholder */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Registration Trends</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center text-gray-400">
                                        <BarChart3 className="h-12 w-12" />
                                        <span className="ml-2">Registration trends chart</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Button variant="outline" onClick={() => handleExport('participants')}>
                                        Export Participants
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport('volunteers')}>
                                        Export Volunteers
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport('donations')}>
                                        Export Donations
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport('items')}>
                                        Export Items
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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