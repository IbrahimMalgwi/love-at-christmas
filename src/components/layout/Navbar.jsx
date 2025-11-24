import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAdmin, signOut } = useAuth();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Items Needed', path: '/items' },
        { name: 'Donate', path: '/donate' },
        { name: 'Register', path: '/register' },
        { name: 'FAQ', path: '/faq' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            {/* Logo Option 1: Image Logo */}
                            <img
                                src="/logo.png"
                                alt="Love at Christmas Logo"
                                className="h-10 w-10 object-contain"
                                onError={(e) => {
                                    // Fallback if logo doesn't exist
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            {/* Fallback: Text-based logo */}
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg hidden">
                                LAC
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-800">
                                Love at Christmas
                            </span>
                        </Link>
                    </div>

                    {/* Rest of the component remains the same */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(item.path)
                                        ? 'text-red-600 border-b-2 border-red-600'
                                        : 'text-gray-700 hover:text-red-600'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Admin Login/Logout */}
                        {isAdmin ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/admin/dashboard"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 hover:bg-green-50 transition-colors"
                                >
                                    Admin Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 transition-colors border border-gray-300 hover:border-red-300"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive(item.path)
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile Admin Login/Logout */}
                            <div className="border-t border-gray-200 pt-2">
                                {isAdmin ? (
                                    <>
                                        <Link
                                            to="/admin/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-green-600 bg-green-50 hover:bg-green-100"
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/admin/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 border border-gray-200"
                                    >
                                        Admin Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;