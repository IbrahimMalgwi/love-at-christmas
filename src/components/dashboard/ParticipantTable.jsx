import React, { useState } from 'react'
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card'
import Button from '../common/Button'

const ParticipantTable = ({ data, onExport }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterSex, setFilterSex] = useState('All')

    // Mock data - replace with actual data from Supabase
    const participants = data || [
        {
            id: 1,
            full_name: 'John Smith',
            phone_number: '+1 (555) 123-4567',
            address: '123 Main St, City, State',
            sex: 'Male',
            age: 35,
            religion: 'Christian',
            created_at: '2024-12-01'
        },
        {
            id: 2,
            full_name: 'Maria Garcia',
            phone_number: '+1 (555) 234-5678',
            address: '456 Oak Ave, City, State',
            sex: 'Female',
            age: 28,
            religion: 'Catholic',
            created_at: '2024-12-02'
        },
        // Add more mock data as needed
    ]

    const filteredParticipants = participants.filter(participant => {
        const matchesSearch =
            participant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.phone_number.includes(searchTerm) ||
            participant.address.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSex = filterSex === 'All' || participant.sex === filterSex

        return matchesSearch && matchesSex
    })

    const sexOptions = ['All', 'Male', 'Female', 'Other']

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <CardTitle>Participants</CardTitle>
                    <div className="flex space-x-3">
                        <Button variant="outline" size="sm" onClick={onExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search participants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Sex Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                            value={filterSex}
                            onChange={(e) => setFilterSex(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {sexOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sex</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Age</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Religion</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Registered</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredParticipants.map(participant => (
                            <tr key={participant.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900">
                                    {participant.full_name}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {participant.phone_number}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        participant.sex === 'Male'
                            ? 'bg-blue-100 text-blue-800'
                            : participant.sex === 'Female'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-gray-100 text-gray-800'
                    }`}>
                      {participant.sex}
                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {participant.age}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {participant.religion}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {new Date(participant.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredParticipants.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No participants found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {filteredParticipants.length} of {participants.length} participants
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ParticipantTable