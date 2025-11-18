import React, { useState } from 'react'
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react'
import EventCalendar from '../components/events/EventCalendar'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { useAuth } from '../context/AuthContext'

const Events = () => {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [showEventModal, setShowEventModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const { isAdmin } = useAuth()

    // Mock events data - only upcoming events
    const events = [
        {
            id: 1,
            title: 'Volunteer Orientation',
            date: '2024-12-05',
            time: '6:00 PM - 8:00 PM',
            location: 'Community Center',
            description: 'Mandatory orientation for all new volunteers. Learn about our mission and your role.',
            type: 'volunteer',
            capacity: 50,
            registered: 35
        },
        {
            id: 2,
            title: 'Gift Wrapping Party',
            date: '2024-12-10',
            time: '2:00 PM - 5:00 PM',
            location: 'Main Hall',
            description: 'Join us for a fun afternoon of wrapping gifts for families in need.',
            type: 'volunteer',
            capacity: 30,
            registered: 22
        },
        {
            id: 3,
            title: 'Food Drive Collection',
            date: '2024-12-12',
            time: '9:00 AM - 4:00 PM',
            location: 'Various Locations',
            description: 'Help collect and sort food donations across the city.',
            type: 'volunteer',
            capacity: 100,
            registered: 78
        },
        {
            id: 4,
            title: 'Love At Christmas Main Event',
            date: '2024-12-20',
            time: '10:00 AM - 6:00 PM',
            location: 'City Convention Center',
            description: 'The main distribution event for families. All volunteers needed.',
            type: 'main',
            capacity: 200,
            registered: 150
        },
        {
            id: 5,
            title: 'Post-Event Celebration',
            date: '2024-12-21',
            time: '7:00 PM - 10:00 PM',
            location: 'Community Church Hall',
            description: 'Celebrate another successful year with food and fellowship.',
            type: 'social',
            capacity: 80,
            registered: 45
        }
    ]

    // Filter to show only upcoming events
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return eventDate >= today
    })

    const handleEventClick = (event) => {
        setSelectedEvent(event)
        setShowEventModal(true)
    }

    const handleAddEvent = () => {
        setShowCreateModal(true)
    }

    const getEventTypeColor = (type) => {
        const colors = {
            volunteer: 'bg-blue-100 text-blue-800',
            main: 'bg-red-100 text-red-800',
            social: 'bg-green-100 text-green-800',
            training: 'bg-purple-100 text-purple-800'
        }
        return colors[type] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Gradient */}
            <section className="bg-gradient-to-br from-green-600 to-teal-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Events & Schedule
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto">
                            Stay updated with all Love At Christmas events, volunteer opportunities, and important dates.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2">
                        <EventCalendar
                            events={upcomingEvents}
                            onEventClick={handleEventClick}
                            onAddEvent={isAdmin() ? handleAddEvent : null}
                            isAdmin={isAdmin()}
                        />
                    </div>

                    {/* Upcoming Events Sidebar */}
                    <div className="space-y-6">
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle>Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingEvents.slice(0, 3).map(event => (
                                        <div
                                            key={event.id}
                                            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
                                            onClick={() => handleEventClick(event)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                                    {event.type}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {event.location}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {event.registered}/{event.capacity}
                                                </div>
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Only show Create Event button for admin users */}
                                {isAdmin() && (
                                    <Button variant="outline" className="w-full mt-4" onClick={handleAddEvent}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create New Event
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Event Detail Modal */}
            <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} size="lg">
                {selectedEvent && (
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                                    {selectedEvent.type}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-3" />
                                <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <Clock className="h-5 w-5 mr-3" />
                                <span>{selectedEvent.time}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-3" />
                                <span>{selectedEvent.location}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600">{selectedEvent.description}</p>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Registration</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{selectedEvent.registered} / {selectedEvent.capacity} registered</span>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${(selectedEvent.registered / selectedEvent.capacity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <Button>
                                Register for Event
                            </Button>
                        </div>

                        <div className="flex space-x-3">
                            <Button variant="outline" className="flex-1">
                                Add to Calendar
                            </Button>
                            <Button variant="outline" className="flex-1">
                                Share Event
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Event Modal - Only accessible by admin */}
            {isAdmin() && (
                <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter event title"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter event location"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Describe the event"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Type
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                        <option value="volunteer">Volunteer</option>
                                        <option value="main">Main Event</option>
                                        <option value="social">Social</option>
                                        <option value="training">Training</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Maximum attendees"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1">
                                Create Event
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Events