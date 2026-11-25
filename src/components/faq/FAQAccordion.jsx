import React from 'react';

export default function FAQAccordion({ faqs }) {
    return <div className="faq-list">{faqs.map(faq => (
        <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>
    ))}</div>;
}
