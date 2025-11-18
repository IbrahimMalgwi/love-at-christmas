import React from 'react'
import Card from '../common/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatsCard = ({ title, value, change, changeType = 'neutral', icon: Icon, description }) => {
    const getTrendIcon = () => {
        switch (changeType) {
            case 'positive':
                return <TrendingUp className="h-4 w-4 text-green-500" />
            case 'negative':
                return <TrendingDown className="h-4 w-4 text-red-500" />
            default:
                return <Minus className="h-4 w-4 text-gray-500" />
        }
    }

    const getChangeColor = () => {
        switch (changeType) {
            case 'positive':
                return 'text-green-600'
            case 'negative':
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                        {change && (
                            <div className={`flex items-center text-sm font-medium ${getChangeColor()}`}>
                                {getTrendIcon()}
                                <span className="ml-1">{change}</span>
                            </div>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-gray-500 mt-2">{description}</p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-primary-100 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                )}
            </div>
        </Card>
    )
}

export default StatsCard