import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Love at Christmas
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        The Foursquare Gospel Church Sabo... Giving hope and sharing Jesus joy to all
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/donate"
                            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
                        >
                            Make a Donation
                        </Link>
                        <Link
                            to="/items"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors text-lg"
                        >
                            Items Needed
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;