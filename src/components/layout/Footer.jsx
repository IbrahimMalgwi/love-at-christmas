import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
    const { isAdmin } = useAuth();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 overflow-hidden">
                                <img
                                    src="/logo.png"
                                    alt="Love at Christmas Logo"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <span className="text-xl font-bold">Love at Christmas</span>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            The Foursquare Gospel Church Sabo... Giving hope and sharing Jesus joy to all
                        </p>
                        <div className="flex space-x-4">
                            {/* Social media links */}
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Visit our Facebook page"
                            >
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Visit our Instagram page"
                            >
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.198-1.558a4.16 4.16 0 01-.84-2.439c0-1.088.417-2.14 1.17-2.91a4.165 4.165 0 012.868-1.16c1.297 0 2.448.611 3.198 1.558.438.561.695 1.258.73 1.987h-6.27v.772h6.27a4.16 4.16 0 01-.73 1.987a4.165 4.16 0 01-3.198 1.558zm7.143-5.832h-1.5v1.5h1.5v-1.5zm1.5 0h-1.5v1.5h1.5v-1.5z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {/* Only show Items Needed link for admin users */}
                            {isAdmin && (
                                <li><Link to="/items" className="text-gray-300 hover:text-white transition-colors">Items Needed</Link></li>
                            )}
                            <li><Link to="/donate" className="text-gray-300 hover:text-white transition-colors">Make a Donation</Link></li>
                            <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link></li>
                            <li><Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
                            <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                            Contact Info
                        </h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>Email: foursquaresabo@yahoo.com</li>
                            <li>Phone: +234 803 212 6739</li>
                            <li>Phone: +234 81 0465 7320</li>
                            <li>32A Commercial Avenue Sabo Yaba, Lagos, Nigeria</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300 text-sm">
                        &copy; 2025 Love at Christmas Program. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-300">
                        <button
                            onClick={() => alert('Privacy Policy page coming soon!')}
                            className="hover:text-white transition-colors cursor-pointer"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => alert('Terms of Service page coming soon!')}
                            className="hover:text-white transition-colors cursor-pointer"
                        >
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;