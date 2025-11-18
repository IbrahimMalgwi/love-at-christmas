import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Users, Gift, CreditCard, Calendar } from 'lucide-react'
import Card from '../components/common/Card'

const FAQ = () => {
    const [openItem, setOpenItem] = useState(null)

    const toggleItem = (id) => {
        setOpenItem(openItem === id ? null : id)
    }

    const faqCategories = [
        {
            id: 'general',
            name: 'General Information',
            icon: HelpCircle,
            questions: [
                {
                    id: 1,
                    question: 'What is Love At Christmas?',
                    answer: 'Love At Christmas is an annual charity event dedicated to spreading love, hope, and practical support to families in need during the Christmas season. We organize gift distributions, community meals, and various support programs to ensure everyone can experience the joy of Christmas.'
                },
                {
                    id: 2,
                    question: 'When and where is the event held?',
                    answer: 'The main event is typically held in December at Foursquare Gospel Church Sabo, 32A Commercial Avenue Sabo Yaba, Lagos Nigeria.'
                },
                {
                    id: 3,
                    question: 'Who can participate in Love At Christmas?',
                    answer: 'Everyone is welcome! We serve families in need, accept volunteers from all backgrounds, and welcome donations from individuals, businesses, and organizations. Whether you want to receive support, volunteer your time, or make a donation, there\'s a place for you.'
                }
            ]
        },
        {
            id: 'volunteering',
            name: 'Volunteering',
            icon: Users,
            questions: [
                {
                    id: 4,
                    question: 'How do I become a volunteer?',
                    answer: 'You can register as a volunteer through our website by filling out the volunteer registration form. Once registered, our volunteer coordinator will contact you with available opportunities and next steps. No prior experience is necessary - we provide all the training you need.'
                },
                {
                    id: 5,
                    question: 'What volunteer roles are available?',
                    answer: 'We have various roles including event setup, registration, food service, gift distribution, security, publicity, and more. You can choose a role that matches your skills and interests during the registration process.'
                },
                {
                    id: 6,
                    question: 'Is there a minimum time commitment?',
                    answer: 'While we appreciate any time you can give, most volunteer shifts are 4-6 hours. You can sign up for multiple shifts if available. Some roles may require additional training or time commitments.'
                }
            ]
        },
        {
            id: 'donations',
            name: 'Donations & Support',
            icon: Gift,
            questions: [
                {
                    id: 7,
                    question: 'What items are most needed?',
                    answer: 'We always need non-perishable food items, new clothing (all sizes), household items, toys, and personal care products. You can view our current most-needed items on the "Items Needed" page, which is regularly updated.'
                },
                {
                    id: 8,
                    question: 'Where can I drop off donated items?',
                    answer: 'We have multiple drop-off locations throughout the city. You can find the nearest location and operating hours on our website. For large donations, we may be able to arrange pickup - please contact us in advance.'
                }
            ]
        },
        {
            id: 'financial',
            name: 'Financial Support',
            icon: CreditCard,
            questions: [
                {
                    id: 10,
                    question: 'How are financial donations used?',
                    answer: '100% of donations go directly to program expenses (purchasing gifts, food, and supplies). We are committed to transparency and provide detailed financial reports annually.'
                },
                {
                    id: 11,
                    question: 'What payment methods do you accept?',
                    answer: 'We accept bank transfers to our account with the description LOVE AT CHRISTMAS 2025 or Cash donations @ Foursquare Gospel Church Sabo.'
                }
            ]
        },
        {
            id: 'events',
            name: 'Events & Participation',
            icon: Calendar,
            questions: [
                {
                    id: 13,
                    question: 'How can my family receive support?',
                    answer: 'Everyone who is present on the day will receive a gift for Christmas.'
                },
                {
                    id: 14,
                    question: 'Do you serve specific areas or is it city-wide?',
                    answer: 'Everyone with the city is welcome to share the love of Christ with us.'
                },
                {
                    id: 15,
                    question: 'Can businesses or organizations partner with you?',
                    answer: 'Absolutely! We welcome partnerships with businesses, churches, schools, and other organizations. Partnership opportunities include sponsorship, employee volunteering, donation drives, and event co-hosting. Please contact our partnership coordinator.'
                }
            ]
        }
    ]

    const handleEmailClick = () => {
        window.location.href = 'mailto:foursquaregoseplchurchsabo@gmail.com'
    }

    const handleCallClick = () => {
        window.location.href = 'tel:+2348104657320'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Gradient */}
            <section className="bg-gradient-to-br from-cyan-600 to-sky-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto">
                            Find answers to common questions about Love At Christmas.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* FAQ Categories */}
                <div className="space-y-6">
                    {faqCategories.map(category => {
                        const Icon = category.icon
                        return (
                            <Card key={category.id} className="overflow-hidden border border-gray-200">
                                {/* Category Header */}
                                <div className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white p-4">
                                    <div className="flex items-center space-x-3">
                                        <Icon className="h-5 w-5" />
                                        <h2 className="text-lg font-bold">{category.name}</h2>
                                    </div>
                                </div>

                                {/* Questions */}
                                <div className="divide-y divide-gray-100">
                                    {category.questions.map(faq => {
                                        const isOpen = openItem === faq.id
                                        return (
                                            <div key={faq.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <button
                                                    onClick={() => toggleItem(faq.id)}
                                                    className="flex justify-between items-center w-full text-left group"
                                                >
                                                    <span className="text-base font-semibold text-gray-900 pr-4 group-hover:text-cyan-600 transition-colors">
                                                        {faq.question}
                                                    </span>
                                                    {isOpen ? (
                                                        <ChevronUp className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 flex-shrink-0 transition-colors" />
                                                    )}
                                                </button>

                                                {isOpen && (
                                                    <div className="mt-3 text-gray-600 leading-relaxed pl-2 border-l-2 border-cyan-200">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* Still Have Questions */}
                <Card className="mt-8 bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200">
                    <div className="text-center p-6">
                        <HelpCircle className="h-10 w-10 text-cyan-600 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-gray-900 mb-3">
                            Still Have Questions?
                        </h2>
                        <p className="text-gray-600 mb-4 max-w-xl mx-auto text-sm">
                            Can't find the answer you're looking for? Please reach out to our team, and we'll be happy to help you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleEmailClick}
                                className="bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-cyan-700 transition-colors shadow-sm"
                            >
                                Email Us
                            </button>
                            <button
                                onClick={handleCallClick}
                                className="border border-cyan-600 text-cyan-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-cyan-600 hover:text-white transition-colors"
                            >
                                Call Us
                            </button>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <p>foursquaregoseplchurchsabo@gmail.com</p>
                            <p>+234 810 465 7320</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default FAQ