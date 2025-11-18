import React from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

const NotificationToast = () => {
    const { notifications, removeNotification } = useNotifications()

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-400" />
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-400" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-400" />
            default:
                return <Info className="h-5 w-5 text-blue-400" />
        }
    }

    const getBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200'
            case 'error':
                return 'bg-red-50 border-red-200'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200'
            default:
                return 'bg-blue-50 border-blue-200'
        }
    }

    if (notifications.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg border shadow-lg ${getBackgroundColor(notification.type)} animate-in slide-in-from-right-full duration-500`}
                >
                    <div className="flex items-start space-x-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                            {notification.title && (
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    {notification.title}
                                </h4>
                            )}
                            <p className="text-sm text-gray-700">
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NotificationToast