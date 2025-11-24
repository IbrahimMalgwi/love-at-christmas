import React, { useState } from 'react';

const FAQAccordion = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
                    >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        <span className="flex-shrink-0 ml-2">
              {openIndex === index ? '−' : '+'}
            </span>
                    </button>
                    {openIndex === index && (
                        <div className="px-6 pb-4">
                            <div className="text-gray-600 leading-relaxed">{faq.answer}</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;