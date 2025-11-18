import React from 'react'
import { Heart, Target, Eye, Clock, MapPin } from 'lucide-react'
import Card from '../components/common/Card'

const About = () => {
    const milestones = [
        { year: '2018', event: 'First Love At Christmas event with 200 participants' },
        { year: '2019', event: 'Expanded to serve 500 families across the city' },
        { year: '2020', event: 'Adapted to virtual events during pandemic, reached 800 families' },
        { year: '2021', event: 'Introduced year-round community support programs' },
        { year: '2022', event: 'Partnered with 50+ local businesses and churches' },
        { year: '2023', event: 'Served over 2,000 participants with 300+ volunteers' },
        { year: '2024', event: 'Launched educational support programs for children' }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        About Love At Christmas
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        For over 3 years, we've been bringing hope and joy to families in need during
                        the Christmas season through community support, donations, and volunteer efforts.
                    </p>
                </div>

                {/* Mission, Vision, Values */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center border border-gray-200">
                        <Target className="h-10 w-10 mx-auto mb-3 text-primary-600" />
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            To spread love, hope, and practical support to families in need during the
                            Christmas season, creating meaningful connections and lasting impact in our community.
                        </p>
                    </Card>

                    <Card className="p-6 text-center border border-gray-200">
                        <Eye className="h-10 w-10 mx-auto mb-3 text-primary-600" />
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Our Vision</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            A world where every family experiences the joy and warmth of Christmas,
                            regardless of their circumstances, through community solidarity and compassion.
                        </p>
                    </Card>

                    <Card className="p-6 text-center border border-gray-200">
                        <Heart className="h-10 w-10 mx-auto mb-3 text-primary-600" />
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Our Values</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Compassion, Community, Integrity, Service, and Hope guide everything we do
                            and every relationship we build.
                        </p>
                    </Card>
                </div>

                {/* History Timeline */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Our Journey</h2>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 h-full"></div>

                        {/* Timeline items */}
                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className="w-1/2 pr-6 pl-6">
                                        <Card className="p-4 border border-gray-200">
                                            <div className="flex items-center mb-2">
                                                <Clock className="h-4 w-4 text-primary-600 mr-2" />
                                                <span className="font-bold text-gray-900 text-sm">{milestone.year}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm">{milestone.event}</p>
                                        </Card>
                                    </div>
                                    <div className="w-6 h-6 bg-primary-600 rounded-full border-4 border-white z-10"></div>
                                    <div className="w-1/2 pl-6 pr-6"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Impact Stories */}
                <section>
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Impact Stories</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 border border-gray-200">
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Community Transformation</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        "Last year, we provided Christmas meals and gifts to over 2,000 families.
                                        The joy and gratitude we witnessed reminded us why we do this work every year."
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border border-gray-200">
                            <div className="flex items-start">
                                <Heart className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Volunteer Experience</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        "As a volunteer for 5 years, I've seen how our efforts create ripples of
                                        positive change. The connections we build last long after Christmas is over."
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default About