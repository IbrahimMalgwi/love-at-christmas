import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = true }) => {
    const { user, admin, loading } = useAuth();
    const { pathname } = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated at all, redirect to login
    if (!user) {
        return <Navigate to="/login" replace state={{ from: pathname }} />;
    }

    // If route requires admin but user is not admin
    if (requireAdmin && !admin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div className="text-red-600 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You don't have administrator privileges to access this page.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;