// src/pages/admin/RegistrationsManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';

const RegistrationsManager = () => {
    const [activeTab, setActiveTab] = useState('volunteers');
    const [volunteers, setVolunteers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filterData = useCallback(() => {
        if (!searchTerm) {
            setFilteredVolunteers(volunteers);
            setFilteredParticipants(participants);
            return;
        }

        const lowerSearch = searchTerm.toLowerCase();

        setFilteredVolunteers(
            volunteers.filter(volunteer =>
                volunteer.full_name.toLowerCase().includes(lowerSearch) ||
                volunteer.email.toLowerCase().includes(lowerSearch) ||
                volunteer.phone.toLowerCase().includes(lowerSearch) ||
                volunteer.church.toLowerCase().includes(lowerSearch) ||
                volunteer.role.toLowerCase().includes(lowerSearch)
            )
        );

        setFilteredParticipants(
            participants.filter(participant =>
                participant.full_name.toLowerCase().includes(lowerSearch) ||
                participant.phone.toLowerCase().includes(lowerSearch) ||
                participant.address.toLowerCase().includes(lowerSearch) ||
                participant.religion.toLowerCase().includes(lowerSearch)
            )
        );
    }, [searchTerm, volunteers, participants]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
        setCurrentPage(1); // Reset to first page when search changes
    }, [filterData]);

    const fetchData = async () => {
        try {
            const [volunteersData, participantsData] = await Promise.all([
                supabase.from('volunteers').select('*').order('created_at', { ascending: false }),
                supabase.from('participants').select('*').order('created_at', { ascending: false })
            ]);

            setVolunteers(volunteersData.data || []);
            setParticipants(participantsData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination functions
    const getCurrentItems = () => {
        const items = activeTab === 'volunteers' ? filteredVolunteers : filteredParticipants;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    const totalPages = () => {
        const totalItems = activeTab === 'volunteers' ? filteredVolunteers.length : filteredParticipants.length;
        return Math.ceil(totalItems / itemsPerPage);
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
        const totalItems = activeTab === 'volunteers' ? filteredVolunteers.length : filteredParticipants.length;
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
                                {Math.min(currentPage * itemsPerPage, totalItems)}
                            </span>{' '}
                            of <span className="font-medium">{totalItems}</span> results
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

    const exportToCSV = (data, filename) => {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0] || {}).filter(key => key !== 'id');
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header] || '';
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const deleteRegistration = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type} registration?`)) return;

        try {
            const tableName = type === 'volunteer' ? 'volunteers' : 'participants';
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;

            fetchData();
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} registration deleted successfully`);
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert(`Failed to delete ${type}: ` + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg">Loading registrations...</div>
            </div>
        );
    }

    const displayItems = getCurrentItems();
    const totalItems = activeTab === 'volunteers' ? filteredVolunteers.length : filteredParticipants.length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Registrations Management</h2>
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

                    <input
                        type="text"
                        placeholder="Search registrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {activeTab === 'volunteers' && (
                        <button
                            onClick={() => exportToCSV(volunteers, 'volunteers')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                        >
                            Export CSV
                        </button>
                    )}
                    {activeTab === 'participants' && (
                        <button
                            onClick={() => exportToCSV(participants, 'participants')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                        >
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => {
                            setActiveTab('volunteers');
                            setCurrentPage(1);
                        }}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'volunteers'
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Volunteers ({filteredVolunteers.length})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('participants');
                            setCurrentPage(1);
                        }}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'participants'
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Participants ({filteredParticipants.length})
                    </button>
                </nav>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 text-sm">
                        Showing {displayItems.length} of {totalItems} results for "{searchTerm}"
                    </p>
                </div>
            )}

            {/* Volunteers Table */}
            {activeTab === 'volunteers' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Church/Organization
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Comments
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {displayItems.map((volunteer) => (
                                <tr key={volunteer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{volunteer.full_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{volunteer.email}</div>
                                        <div className="text-sm text-gray-500">{volunteer.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {volunteer.church}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {volunteer.role}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 max-w-xs">
                                            {volunteer.additional_comments || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(volunteer.created_at).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(volunteer.created_at).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => deleteRegistration('volunteer', volunteer.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <PaginationControls />

                    {filteredVolunteers.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                {searchTerm ? 'No volunteer registrations match your search.' : 'No volunteer registrations found.'}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Participants Table */}
            {activeTab === 'participants' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Demographics
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Special Needs
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {displayItems.map((participant) => (
                                <tr key={participant.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{participant.full_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {participant.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{participant.sex}</div>
                                        <div className="text-sm text-gray-500">Age: {participant.age}</div>
                                        <div className="text-sm text-gray-500">{participant.religion}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs">
                                            {participant.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 max-w-xs">
                                            {participant.special_needs || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(participant.created_at).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(participant.created_at).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => deleteRegistration('participant', participant.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <PaginationControls />

                    {filteredParticipants.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                {searchTerm ? 'No participant registrations match your search.' : 'No participant registrations found.'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RegistrationsManager;