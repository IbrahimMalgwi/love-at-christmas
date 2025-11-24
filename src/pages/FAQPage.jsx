import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import FAQAccordion from '../components/faq/FAQAccordion';
import FAQSearch from '../components/faq/FAQSearch';

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'general', label: 'General' },
        { value: 'donations', label: 'Donations' },
        { value: 'volunteering', label: 'Volunteering' },
        { value: 'participation', label: 'Participation' }
    ];

    useEffect(() => {
        fetchFAQs();
    }, []);

    useEffect(() => {
        filterFAQs();
    }, [faqs, searchTerm, selectedCategory]);

    const fetchFAQs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order');

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterFAQs = () => {
        let filtered = faqs;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(faq => faq.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFaqs(filtered);
    };

    const getFAQsByCategory = () => {
        if (selectedCategory !== 'all') {
            return { [selectedCategory]: filteredFaqs };
        }

        const categorized = {};
        categories.forEach(cat => {
            if (cat.value !== 'all') {
                categorized[cat.value] = faqs.filter(faq => faq.category === cat.value);
            }
        });
        return categorized;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">Loading FAQs...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600">
                        Find answers to common questions about Love at Christmas
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <FAQSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </div>

                {/* FAQs */}
                <div className="space-y-8">
                    {selectedCategory === 'all' ? (
                        categories
                            .filter(cat => cat.value !== 'all')
                            .map(category => {
                                const categoryFaqs = faqs.filter(faq => faq.category === category.value);
                                if (categoryFaqs.length === 0) return null;

                                return (
                                    <div key={category.value} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="bg-red-600 px-6 py-4">
                                            <h2 className="text-xl font-bold text-white">{category.label}</h2>
                                        </div>
                                        <div className="p-6">
                                            <FAQAccordion faqs={categoryFaqs} />
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-red-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">
                                    {categories.find(cat => cat.value === selectedCategory)?.label}
                                </h2>
                            </div>
                            <div className="p-6">
                                <FAQAccordion faqs={filteredFaqs} />
                            </div>
                        </div>
                    )}
                </div>

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">No FAQs found matching your criteria.</div>
                        <p className="text-gray-600">
                            Please try different search terms or browse all categories.
                        </p>
                    </div>
                )}

                {/* Contact Section */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
                    <p className="text-gray-600 mb-6">
                        We're here to help! Contact us directly and we'll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="tel:+2348000000000"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            📞 Call Us
                        </a>
                        <a
                            href="mailto:info@loveatchristmas.org"
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            ✉️ Email Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;