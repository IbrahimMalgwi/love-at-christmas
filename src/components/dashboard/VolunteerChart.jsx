import React from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card'
import { Users, Camera, DollarSign, Palette, Heart, Shield, Truck } from 'lucide-react'

const VolunteerChart = ({ data }) => {
    // Mock data - replace with actual data from Supabase
    const volunteerData = data || [
        { role: 'Publicity/Media', count: 45, icon: Camera },
        { role: 'Finance', count: 23, icon: DollarSign },
        { role: 'Aesthetics/Ambiance', count: 34, icon: Palette },
        { role: 'Prayer and Counseling', count: 56, icon: Heart },
        { role: 'Registration', count: 67, icon: Users },
        { role: 'Security', count: 28, icon: Shield },
        { role: 'Logistics', count: 39, icon: Truck }
    ]

    const totalVolunteers = volunteerData.reduce((sum, item) => sum + item.count, 0)

    const getRoleIcon = (role) => {
        const icons = {
            'Publicity/Media': Camera,
            'Finance': DollarSign,
            'Aesthetics/Ambiance': Palette,
            'Prayer and Counseling': Heart,
            'Registration': Users,
            'Security': Shield,
            'Logistics': Truck
        }
        return icons[role] || Users
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Volunteers by Role</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {volunteerData.map((item, index) => {
                        const Icon = getRoleIcon(item.role)
                        const percentage = totalVolunteers > 0 ? (item.count / totalVolunteers) * 100 : 0

                        return (
                            <div key={item.role} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <Icon className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {item.role}
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{item.count}</p>
                                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Total Volunteers</span>
                        <span className="text-lg font-bold text-primary-600">{totalVolunteers}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default VolunteerChart