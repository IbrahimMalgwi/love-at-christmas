// src/pages/Auth.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import { useAuth } from '../context/AuthContext'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleSuccess = () => {
        // Use React Router navigate instead of window.location
        // This gives time for the auth state to update properly
        setTimeout(() => {
            navigate('/', { replace: true })
        }, 100)
    }

    if (user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">You're already signed in!</h2>
                    <Link to="/" className="text-primary-600 hover:text-primary-700">
                        Go to homepage
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                        <Heart className="h-8 w-8 text-primary-600" />
                        <span className="font-bold text-2xl text-gray-900">Love At Christmas</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isLogin ? 'Welcome Back' : 'Become a Volunteer'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isLogin ? 'Sign in to your volunteer account' : 'Create your volunteer account to get started'}
                    </p>
                </div>

                {/* Auth Form */}
                {isLogin ? (
                    <LoginForm
                        onSuccess={handleSuccess}
                        onSwitchToSignup={() => setIsLogin(false)}
                    />
                ) : (
                    <SignupForm
                        onSuccess={handleSuccess}
                        onSwitchToLogin={() => setIsLogin(true)}
                    />
                )}

                {/* Additional Links */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Auth