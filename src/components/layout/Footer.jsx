import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, Phone } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Heart className="h-6 w-6 text-primary-400" />
                            <span className="font-bold text-xl">Love At Christmas</span>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Spreading love and joy during the Christmas season. Join us in making a difference
                            in our community through volunteer work, donations, and heartfelt connections.
                        </p>
                        <div className="flex space-x-4">
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Mail className="h-4 w-4" />
                                <span>info@loveatchristmas.org</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link></li>
                            <li><Link to="/items-needed" className="text-gray-300 hover:text-white transition-colors">Items Needed</Link></li>
                            <li><Link to="/donate" className="text-gray-300 hover:text-white transition-colors">Donate</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                    <p>&copy; 2025 Love At Christmas. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer