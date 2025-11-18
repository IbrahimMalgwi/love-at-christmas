import React from 'react'

const Card = ({
                  children,
                  className = '',
                  padding = 'p-6',
                  shadow = 'shadow-sm',
                  ...props
              }) => {
    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 ${padding} ${shadow} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>
        {children}
    </div>
)

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h3>
)

export const CardContent = ({ children, className = '' }) => (
    <div className={className}>
        {children}
    </div>
)

export default Card