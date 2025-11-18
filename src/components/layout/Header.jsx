import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Heart, User, LogOut, Settings, Shield } from 'lucide-react'
import Button from '../common/Button'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user, signOut, isAdmin, isVolunteer } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Events', href: '/events' },
        { name: 'Items Needed', href: '/items-needed' },
        { name: 'Register', href: '/register' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Donate', href: '/donate' },
        { name: 'FAQ', href: '/faq' },
    ]

    // Add admin/volunteer specific navigation
    if (isAdmin() || isVolunteer()) {
        navigation.push({ name: 'Dashboard', href: '/admin' })
    }

    const isActive = (path) => location.pathname === path

    const handleSignOut = async () => {
        try {
            await signOut()
            setShowUserMenu(false)
            navigate('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const getUserDisplayName = () => {
        if (user?.user_metadata?.full_name) {
            return user.user_metadata.full_name
        }
        return user?.email?.split('@')[0] || 'User'
    }

    const getUserRoleBadge = () => {
        if (isAdmin()) return { text: 'Admin', color: 'bg-red-100 text-red-800' }
        if (isVolunteer()) return { text: 'Volunteer', color: 'bg-blue-100 text-blue-800' }
        return { text: 'Participant', color: 'bg-green-100 text-green-800' }
    }

    const roleBadge = getUserRoleBadge()

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Heart className="h-8 w-8 text-primary-600" />
                            <span className="font-bold text-xl text-gray-900">
                                Love At Christmas
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-sm font-medium text-gray-700 block">
                                                {getUserDisplayName()}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${roleBadge.color}`}>
                                                {roleBadge.text}
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${roleBadge.color}`}>
                                                {roleBadge.text}
                                            </span>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Profile
                                        </Link>

                                        {(isAdmin() || isVolunteer()) && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                Dashboard
                                            </Link>
                                        )}

                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Link>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/auth">
                                    <Button variant="outline" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                {/* Changed from /auth?tab=signup to /register */}
                                <Link to="/register">
                                    <Button size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive(item.href)
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile Auth Links */}
                            <div className="pt-4 border-t border-gray-200">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${roleBadge.color}`}>
                                                {roleBadge.text}
                                            </span>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                        >
                                            Profile
                                        </Link>

                                        {(isAdmin() || isVolunteer()) && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                            >
                                                Dashboard
                                            </Link>
                                        )}

                                        <Link
                                            to="/settings"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                        >
                                            Settings
                                        </Link>

                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            to="/auth"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                        >
                                            Sign In
                                        </Link>
                                        {/* Changed from /auth?tab=signup to /register */}
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 bg-primary-50"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header