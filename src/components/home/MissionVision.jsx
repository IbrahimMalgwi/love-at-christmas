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
                            that restore hope and spread the love of Christ throughout our community.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="text-center md:text-left">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                            <span className="text-2xl">✝️</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            To share the love of Christ with everyone we serve, showing love to people
                            "the Jesus way." We envision communities transformed by unconditional love,
                            where every person experiences the hope and joy that comes from knowing
                            Christ's love, especially during the Christmas season.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mt-16 bg-red-50 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Our Guiding Principle
                    </h2>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="text-6xl mb-6">❤️</div>
                        <p className="text-xl text-gray-700 leading-relaxed italic">
                            "We are called to love one another as Christ loved us. Our mission is not just
                            about giving gifts, but about sharing the greatest gift of all - the love of Jesus.
                            Every act of kindness, every warm meal, every essential item we provide is an
                            expression of God's love in action."
                        </p>
                    </div>
                </div>

                {/* Program Activities */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        How We Share God's Love
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎁',
                                title: 'Gift Distribution',
                                description: 'Providing carefully selected gifts and essential items as tangible expressions of God\'s love and care for families in need'
                            },
                            {
                                icon: '🙏',
                                title: 'NPC Fellowship',
                                description: 'Organizing Neighborhood Prayer Cell gatherings where communities experience Christian fellowship, prayer, and hear the message of hope'
                            },
                            {
                                icon: '💝',
                                title: 'Spiritual Support',
                                description: 'Offering prayer, counseling, and spiritual guidance to strengthen families in their faith journey'
                            }
                        ].map((activity, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
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

                {/* Bible Verse */}
                <div className="mt-12 text-center">
                    <div className="bg-white border border-red-200 rounded-lg p-6 inline-block">
                        <p className="text-lg text-gray-700 italic">
                            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
                        </p>
                        <p className="text-red-600 font-semibold mt-2">- John 3:16</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;