import React from 'react';

const MissionVision = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Mission */}
                    <div className="text-center md:text-left">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            To bring the true spirit of Christmas to underprivileged families by providing
                            essential items, warm clothing, nutritious food, and creating memorable experiences
                            that restore hope and spread joy throughout our community.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="text-center md:text-left">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                            <span className="text-2xl">🌟</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            A world where every family can experience the warmth and joy of Christmas,
                            regardless of their circumstances. We envision communities united in compassion,
                            where no one feels alone during the holiday season.
                        </p>
                    </div>
                </div>

                {/* Program Activities */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        How We Make an Impact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎁',
                                title: 'Gift Distribution',
                                description: 'Providing carefully selected gifts and essential items to families in need'
                            },
                            {
                                icon: '🍽️',
                                title: 'Christmas Dinner',
                                description: 'Organizing community meals to bring people together in celebration'
                            },
                            {
                                icon: '👨‍👩‍👧‍👦',
                                title: 'Family Support',
                                description: 'Offering counseling and support services to strengthen families'
                            }
                        ].map((activity, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="text-4xl mb-4">{activity.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {activity.title}
                                </h3>
                                <p className="text-gray-600">
                                    {activity.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;