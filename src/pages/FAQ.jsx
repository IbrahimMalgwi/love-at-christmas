import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Users, Gift, CreditCard, Calendar } from 'lucide-react'
import Card from '../components/common/Card'

const FAQ = () => {
    const [openItems, setOpenItems] = useState(new Set())

    const toggleItem = (id) => {
        const newOpenItems = new Set(openItems)
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id)
        } else {
            newOpenItems.add(id)
        }
        setOpenItems(newOpenItems)
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
                    answer: 'The main event is typically held in the third week of December at multiple locations across the city. Specific dates and venues for Love At Christmas 2025 will be announced in October 2025. Please check our website regularly for updates.'
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
                },
                {
                    id: 9,
                    question: 'Are financial donations tax-deductible?',
                    answer: 'Yes, Love At Christmas is a registered 501(c)(3) nonprofit organization. All financial donations are tax-deductible to the extent allowed by law. You will receive a receipt for your records.'
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
                    answer: '85% of donations go directly to program expenses (purchasing gifts, food, and supplies), 10% covers administrative costs, and 5% supports fundraising efforts. We are committed to transparency and provide detailed financial reports annually.'
                },
                {
                    id: 11,
                    question: 'What payment methods do you accept?',
                    answer: 'We accept bank transfers, credit/debit cards (Visa, MasterCard, American Express), and QR code payments through various mobile apps. All payment methods are secure and encrypted.'
                },
                {
                    id: 12,
                    question: 'Can I set up recurring donations?',
                    answer: 'Yes! We offer monthly recurring donation options. This helps us maintain consistent support throughout the year and plan our programs more effectively. You can set this up through our donation page.'
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
                    answer: 'Families can register through our participant registration form on the website. After registration, our team will review applications and contact eligible families with event details and next steps.'
                },
                {
                    id: 14,
                    question: 'Do you serve specific areas or is it city-wide?',
                    answer: 'We serve the entire metropolitan area through multiple distribution centers and partner locations. We strive to make our services accessible to all communities within the city and surrounding areas.'
                },
                {
                    id: 15,
                    question: 'Can businesses or organizations partner with you?',
                    answer: 'Absolutely! We welcome partnerships with businesses, churches, schools, and other organizations. Partnership opportunities include sponsorship, employee volunteering, donation drives, and event co-hosting. Please contact our partnership coordinator.'
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find answers to common questions about Love At Christmas
                    </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {faqCategories.map(category => {
                        const Icon = category.icon
                        return (
                            <Card key={category.id} className="overflow-hidden">
                                {/* Category Header */}
                                <div className="bg-primary-600 text-white p-6">
                                    <div className="flex items-center space-x-3">
                                        <Icon className="h-6 w-6" />
                                        <h2 className="text-xl font-bold">{category.name}</h2>
                                    </div>
                                </div>

                                {/* Questions */}
                                <div className="divide-y divide-gray-200">
                                    {category.questions.map(faq => {
                                        const isOpen = openItems.has(faq.id)
                                        return (
                                            <div key={faq.id} className="p-6">
                                                <button
                                                    onClick={() => toggleItem(faq.id)}
                                                    className="flex justify-between items-center w-full text-left"
                                                >
                          <span className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </span>
                                                    {isOpen ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                    )}
                                                </button>

                                                {isOpen && (
                                                    <div className="mt-4 text-gray-600 leading-relaxed">
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
                <Card className="mt-12 bg-primary-50 border-primary-200">
                    <div className="text-center p-8">
                        <HelpCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Can't find the answer you're looking for? Please reach out to our team,
                            and we'll be happy to help you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:info@loveatchristmas.org"
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                            >
                                Email Us
                            </a>
                            <a
                                href="tel:+15551234567"
                                className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
                            >
                                Call Us
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default FAQ