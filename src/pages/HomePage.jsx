import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
// import MissionVision from '../components/home/MissionVision';
import StatsCounter from '../components/home/StatsCounter';

const HomePage = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            {/*<MissionVision />*/}
            <StatsCounter />

            {/* Call to Action Section */}
            <section className="py-16 bg-red-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Ready to Make a Difference?
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Register Now
                        </Link>
                        <Link
                            to="/donate"
                            className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-red-700 transition-colors"
                        >
                            Make a Donation
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;