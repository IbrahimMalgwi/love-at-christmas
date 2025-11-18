import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import { useAuth } from '../context/AuthContext'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const { user } = useAuth()

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
                        {isLogin ? 'Welcome Back' : 'Join Our Community'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
                    </p>
                </div>

                {/* Auth Form */}
                {isLogin ? (
                    <LoginForm
                        onSuccess={() => window.location.href = '/'}
                        onSwitchToSignup={() => setIsLogin(false)}
                    />
                ) : (
                    <SignupForm
                        onSuccess={() => window.location.href = '/'}
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