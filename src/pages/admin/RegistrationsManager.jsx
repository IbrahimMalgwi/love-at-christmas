import { currentRegistrationYear, registrationDate, registrationYear } from '../../shared/registrationYear.mjs';
import { normalizePhone } from '../../shared/participantIdentity.mjs';
import RegistrationDetails from './RegistrationDetails';
import ReadError from '../../components/common/ReadError';
import Papa from 'papaparse';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { firestoreService, collections } from '../../services/firestore';

const RegistrationsManager = () => {
    const [activeTab, setActiveTab] = useState('participants');
    const year = currentRegistrationYear();
    const [selectedYear, setSelectedYear] = useState('all');
    const [selection, setSelection] = useState(null);
    const detailsTrigger = useRef(null);

    function viewDetails(event, type, record) {
        detailsTrigger.current = event.currentTarget;
        setSelection({ type, record });
    }

    function closeDetails() {
        setSelection(null);
        detailsTrigger.current?.focus();
    }
    const [volunteers, setVolunteers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [readFailed, setReadFailed] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const availableYears = useMemo(() => {
        const years = new Set([year, year - 1]);
        [...volunteers, ...participants].forEach(record => years.add(registrationYear(record)));
        return [...years].filter(entry => entry !== null).sort((first, second) => second - first);
    }, [year, volunteers, participants]);

    const matchesYear = useCallback(record => {
        if (selectedYear === 'all') return true;
        const value = registrationYear(record);
        return (value === null ? 'undated' : String(value)) === selectedYear;
    }, [selectedYear]);
    const annualVolunteers = useMemo(() => volunteers.filter(matchesYear), [volunteers, matchesYear]);
    const annualParticipants = useMemo(() => participants.filter(matchesYear), [participants, matchesYear]);
    const hasUndated = [...volunteers, ...participants].some(record => registrationYear(record) === null);

    const filterData = useCallback(() => {
        if (!searchTerm) {
            setFilteredVolunteers(annualVolunteers);
            setFilteredParticipants(annualParticipants);
            return;
        }

        const lowerSearch = searchTerm.trim().toLowerCase();
        const exactPhone = normalizePhone(searchTerm);

        setFilteredVolunteers(
            annualVolunteers.filter(volunteer =>
                volunteer.full_name?.toLowerCase().includes(lowerSearch) ||
                volunteer.email?.toLowerCase().includes(lowerSearch) ||
                volunteer.phone?.toLowerCase().includes(lowerSearch) ||
                volunteer.church?.toLowerCase().includes(lowerSearch) ||
                volunteer.role?.toLowerCase().includes(lowerSearch)
            )
        );

        setFilteredParticipants(
            annualParticipants.filter(participant =>
                participant.full_name?.toLowerCase().includes(lowerSearch) ||
                participant.phone?.toLowerCase().includes(lowerSearch) ||
                (exactPhone && normalizePhone(participant.phone) === exactPhone) ||
                participant.address?.toLowerCase().includes(lowerSearch) ||
                participant.religion?.toLowerCase().includes(lowerSearch)
            )
        );
    }, [searchTerm, annualVolunteers, annualParticipants]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
        setCurrentPage(1);
    }, [filterData]);

    const fetchData = async () => {
        setLoading(true);
        setReadFailed(false);
        try {
            const [volunteersData, participantsData] = await Promise.all([
                firestoreService.getAll(collections.VOLUNTEERS, null),
                firestoreService.getAll(collections.PARTICIPANTS, null)
            ]);

            const newestFirst = (first, second) => (registrationYear(second) ?? -Infinity)
                - (registrationYear(first) ?? -Infinity) || (registrationDate(second)?.getTime() ?? 0)
                - (registrationDate(first)?.getTime() ?? 0);
            setVolunteers(volunteersData.sort(newestFirst));
            setParticipants(participantsData.sort(newestFirst));
        } catch (error) {
            setReadFailed(true);
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

        const fields = filename === 'volunteers'
            ? ['full_name', 'email', 'phone', 'church', 'role', 'additional_comments', 'createdAt', 'campaignYear']
            : ['full_name', 'phone', 'address', 'sex', 'age', 'religion', 'special_needs', 'createdAt', 'campaignYear'];
        const csvContent = Papa.unparse({
            fields,
            data: data.map(row => fields.map(field => {
                const value = row[field];
                if (field === 'createdAt') return registrationDate(row)?.toISOString() ?? '';
                if (field === 'campaignYear') return registrationYear(row) ?? '';
                return value ?? '';
            }))
        }, { escapeFormulae: /^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/u });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}-${selectedYear}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const deleteRegistration = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type} registration?`)) return;

        try {
            const collectionName = type === 'volunteer' ? collections.VOLUNTEERS : collections.PARTICIPANTS;
            await firestoreService.delete(collectionName, id);

            // Calculate if we need to go to previous page after deletion
            const currentItems = getCurrentItems();

            // If we're deleting the last item on the page and it's not the first page
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

            // Fetch fresh data
            await fetchData();

            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} registration deleted successfully`);
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert(`Failed to delete ${type}: ` + error.message);
        }
    };

    if (readFailed) return <ReadError onRetry={fetchData} />;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg">Loading registrations...</div>
            </div>
        );
    }

    const displayItems = getCurrentItems();
    const yearGroups = new Map();
    for (const record of displayItems) {
        const recordYear = registrationYear(record);
        if (!yearGroups.has(recordYear)) yearGroups.set(recordYear, []);
        yearGroups.get(recordYear).push(record);
    }
    const hasRegistrations = (activeTab === 'volunteers' ? volunteers : participants).length > 0;
    const showAllYears = selectedYear !== 'all' && hasRegistrations && !searchTerm;
    const exportScope = selectedYear === 'all' ? 'all years' : selectedYear;
    const totalItems = activeTab === 'volunteers' ? filteredVolunteers.length : filteredParticipants.length;
    const totalPagesCount = totalPages();

    // Check if current page is empty and adjust if needed
    if (totalPagesCount > 0 && currentPage > totalPagesCount) {
        // This will trigger automatically on next render
        setCurrentPage(Math.max(1, totalPagesCount));
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Registrations Management</h2>
                <div className="flex flex-wrap items-center gap-3">
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

                    <label className="flex flex-wrap items-center gap-2">
                        Campaign year
                        <select value={selectedYear} onChange={event => setSelectedYear(event.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2">
                            {availableYears.map(entry => <option key={entry} value={entry}>{entry}</option>)}
                            {hasUndated && <option value="undated">Undated records</option>}
                            <option value="all">All years</option>
                        </select>
                    </label>
                    <input
                        type="text"
                        aria-label="Search registrations"
                        placeholder="Search registrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {activeTab === 'volunteers' && (
                        <button
                            onClick={() => exportToCSV(annualVolunteers, 'volunteers')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                        >
                            Export {exportScope} CSV
                        </button>
                    )}
                    {activeTab === 'participants' && (
                        <button
                            onClick={() => exportToCSV(annualParticipants, 'participants')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                        >
                            Export {exportScope} CSV
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

            {/* No Results Message */}
            {displayItems.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <div className="text-gray-500 text-lg mb-2">
                        {searchTerm
                            ? 'No registrations match your search.'
                            : activeTab === 'volunteers'
                                ? 'No volunteer registrations in this view.'
                                : 'No participant registrations in this view.'
                        }
                    </div>
                    {showAllYears && (
                        <button type="button" className="text-link" onClick={() => setSelectedYear('all')}>
                            Show registrations from all years
                        </button>
                    )}
                    {searchTerm && <p className="text-gray-500 text-sm">Try clearing your search.</p>}
                </div>
            )}

            {/* Volunteers Table */}
            {activeTab === 'volunteers' && displayItems.length > 0 && (
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
                            {Array.from(yearGroups, ([groupYear, records]) => (
                                <tbody key={groupYear ?? 'undated'} className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <th scope="rowgroup" colSpan={7} className="bg-gray-100 px-6 py-3 text-left">
                                            {groupYear ?? 'Undated records'}
                                        </th>
                                    </tr>
                                    {records.map((volunteer) => (
                                        <tr key={volunteer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{volunteer.full_name || 'N/A'}</div>
                                                <button type="button" className="text-link mt-1"
                                                    onClick={event => viewDetails(event, 'Volunteer', volunteer)}
                                                    aria-label={`View details for ${volunteer.full_name || 'volunteer'}`}>
                                                    View details
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{volunteer.email || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{volunteer.phone || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {volunteer.church || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                {volunteer.role || 'Unspecified'}
                              </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs">
                                                    {volunteer.additional_comments || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {volunteer.createdAt?.toDate
                                                    ? new Date(volunteer.createdAt.toDate()).toLocaleDateString()
                                                    : volunteer.created_at
                                                        ? new Date(volunteer.created_at).toLocaleDateString()
                                                        : 'N/A'
                                                }
                                                <div className="text-xs text-gray-400">
                                                    {volunteer.createdAt?.toDate
                                                        ? new Date(volunteer.createdAt.toDate()).toLocaleTimeString()
                                                        : volunteer.created_at
                                                            ? new Date(volunteer.created_at).toLocaleTimeString()
                                                            : ''
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => deleteRegistration('volunteer', volunteer.id)}
                                                    className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ))}
                        </table>
                    </div>

                    {/* Pagination */}
                    <PaginationControls />
                </div>
            )}

            {/* Participants Table */}
            {activeTab === 'participants' && displayItems.length > 0 && (
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
                            {Array.from(yearGroups, ([groupYear, records]) => (
                                <tbody key={groupYear ?? 'undated'} className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <th scope="rowgroup" colSpan={7} className="bg-gray-100 px-6 py-3 text-left">
                                            {groupYear ?? 'Undated records'}
                                        </th>
                                    </tr>
                                    {records.map((participant) => (
                                        <tr key={participant.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{participant.full_name || 'N/A'}</div>
                                                <button type="button" className="text-link mt-1"
                                                    onClick={event => viewDetails(event, 'Participant', participant)}
                                                    aria-label={`View details for ${participant.full_name || 'participant'}`}>
                                                    View details
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {participant.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 capitalize">{participant.sex || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">Age: {participant.age ?? 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{participant.religion || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs">
                                                    {participant.address || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs">
                                                    {participant.special_needs || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {participant.createdAt?.toDate
                                                    ? new Date(participant.createdAt.toDate()).toLocaleDateString()
                                                    : participant.created_at
                                                        ? new Date(participant.created_at).toLocaleDateString()
                                                        : 'N/A'
                                                }
                                                <div className="text-xs text-gray-400">
                                                    {participant.createdAt?.toDate
                                                        ? new Date(participant.createdAt.toDate()).toLocaleTimeString()
                                                        : participant.created_at
                                                            ? new Date(participant.created_at).toLocaleTimeString()
                                                            : ''
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => deleteRegistration('participant', participant.id)}
                                                    className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ))}
                        </table>
                    </div>

                    {/* Pagination */}
                    <PaginationControls />
                </div>
            )}
            <RegistrationDetails selection={selection} onClose={closeDetails} />
        </div>
    );
};

export default RegistrationsManager;
