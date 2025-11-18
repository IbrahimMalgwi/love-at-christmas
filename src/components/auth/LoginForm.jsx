import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import Card from '../common/Card'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const LoginForm = ({ onSuccess, onSwitchToSignup }) => {
    const { signIn } = useAuth()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // FIXED: Pass email and password as separate parameters, not as an object
            const { data, error } = await signIn(formData.email, formData.password)

            if (error) throw error

            if (onSuccess) {
                onSuccess(data)
            }
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-md mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </Card>
    )
}

export default LoginForm