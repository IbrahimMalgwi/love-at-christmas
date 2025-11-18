import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, Gift, Calendar, ArrowRight } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const Home = () => {
    const stats = [
        { icon: Users, label: 'Participants Helped', value: '2,500+', color: 'text-blue-600' },
        { icon: Heart, label: 'Volunteers', value: '300+', color: 'text-red-600' },
        { icon: Gift, label: 'Items Donated', value: '5,000+', color: 'text-green-600' },
        { icon: Calendar, label: 'Years Running', value: '8', color: 'text-purple-600' },
    ]

    const features = [
        {
            title: 'Make a Difference',
            description: 'Join hundreds of volunteers in spreading Christmas joy to families in need.',
            icon: Heart,
            link: '/register',
            linkText: 'Become a Volunteer'
        },
        {
            title: 'Donate Items',
            description: 'Contribute clothing, food, household items, and more to support our cause.',
            icon: Gift,
            link: '/items-needed',
            linkText: 'See Needed Items'
        },
        {
            title: 'Financial Support',
            description: 'Help us reach more families through monetary donations and sponsorships.',
            icon: Users,
            link: '/donate',
            linkText: 'Donate Now'
        }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Love At Christmas <span className="text-yellow-300">2025</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                            Spreading love, hope, and joy to families in need during the Christmas season.
                            Join us in making this holiday season special for everyone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                                <Link to="/register" className="flex items-center">
                                    Get Involved <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                                <Link to="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="text-center p-4 border border-gray-200">
                                <stat.icon className={`h-10 w-10 mx-auto mb-3 ${stat.color}`} />
                                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            How You Can Help
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            There are many ways to get involved and make a difference this Christmas season.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature.description}</p>
                                <Button variant="outline" className="w-full">
                                    <Link to={feature.link} className="flex items-center justify-center text-sm">
                                        {feature.linkText} <ArrowRight className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-primary-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to Make a Difference?
                    </h2>
                    <p className="mb-6 opacity-90">
                        Join us in spreading love and joy this Christmas. Every contribution matters.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button size="lg" variant="secondary">
                            <Link to="/register">Register Now</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                            <Link to="/donate">Make a Donation</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home