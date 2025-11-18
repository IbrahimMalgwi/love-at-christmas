import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card'
import Button from '../common/Button'

const EventCalendar = ({ events = [], onEventClick, onAddEvent, isAdmin = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date())

    const today = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(year, month + direction, 1))
    }

    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === today.toDateString()
    })

    const getEventsForDay = (day) => {
        return events.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
        })
    }

    const isToday = (day) => {
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
        <div className="space-y-6">
            {/* Today's Events */}
            {todayEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {todayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                        <p className="text-sm text-gray-600">{event.time}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => onEventClick(event)}>
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Calendar */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            {monthNames[month]} {year}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            {/* Only show Add Event button for admin users */}
                            {isAdmin && onAddEvent && (
                                <Button variant="outline" size="sm" onClick={() => onAddEvent()}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Event
                                </Button>
                            )}
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startingDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="h-24 border border-gray-100 rounded-lg" />
                        ))}

                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const dayEvents = getEventsForDay(day)
                            return (
                                <div
                                    key={day}
                                    className={`h-24 border rounded-lg p-1 overflow-y-auto ${
                                        isToday(day)
                                            ? 'border-primary-300 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${
                                        isToday(day) ? 'text-primary-600' : 'text-gray-900'
                                    }`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map(event => (
                                            <div
                                                key={event.id}
                                                className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded cursor-pointer hover:bg-blue-200"
                                                onClick={() => onEventClick(event)}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-gray-500">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default EventCalendar