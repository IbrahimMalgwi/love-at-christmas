import { useState,  createContext, useContext } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            type: notification.type || 'info',
            title: notification.title,
            message: notification.message,
            read: false,
            timestamp: new Date(),
            ...notification
        }

        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)

        // Auto-remove after 5 seconds for toast notifications
        if (notification.autoHide !== false) {
            setTimeout(() => {
                removeNotification(newNotification.id)
            }, 5000)
        }
    }

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        )
        setUnreadCount(0)
    }

    const value = {
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}