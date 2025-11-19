// src/components/common/ProtectedRoute.jsx
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    // Check if specific role is required
    if (requiredRole) {
        const hasRequiredRole = Array.isArray(requiredRole)
            ? requiredRole.includes(profile?.user_role)
            : profile?.user_role === requiredRole

        if (!hasRequiredRole) {
            return <Navigate to="/" replace />
        }
    }

    return children
}

export default ProtectedRoute