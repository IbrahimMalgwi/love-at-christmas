import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FAQAccordion from '../components/faq/FAQAccordion';
import ReadError from '../components/common/ReadError';
import { firestoreService, collections } from '../services/firestore';

const categories = [['general', 'General'], ['donations', 'Donations'], ['volunteering', 'Volunteering'], ['participation', 'Participation']];

export default function FAQPage() {
    const [state, setState] = useState({ loading: true, faqs: [] });
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const load = useCallback(async () => {
        setState({ loading: true, faqs: [] });
        try {
            const faqs = await firestoreService.getAll(collections.FAQS);
            setState({ faqs: faqs.sort((first, second) => (first.order || 0) - (second.order || 0)) });
        } catch {
            setState({ error: true, faqs: [] });
        }
    }, []);
    useEffect(() => { load(); }, [load]);

    const filtered = state.faqs.filter(faq => (!category || category === faq.category) &&
        [faq.question, faq.answer].some(value => (value || '').toLowerCase().includes(query.trim().toLowerCase())));

    return <div className="site-wrap section-spacing faq-layout">
        <header className="page-heading"><p className="eyebrow">Need help?</p><h1>Frequently asked questions</h1><p>Find answers about donating, registering and volunteering.</p></header>
        <div>
            <div className="filter-row">
                <label>Search questions<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>
                <label>Category<select value={category} onChange={event => setCategory(event.target.value)}>
                    <option value="">All categories</option>{categories.map(([key, label]) => <option value={key} key={key}>{label}</option>)}
                </select></label>
            </div>
            {state.loading ? <p role="status">Loading questions…</p> : state.error ? <ReadError onRetry={load} /> :
                filtered.length ? <FAQAccordion faqs={filtered} /> : <p role="status">{state.faqs.length ? 'No questions match your filters.' : 'No questions have been published yet.'}</p>}
            <p className="faq-contact">Still have a question? <a className="text-link" href="mailto:foursquaresabo@yahoo.com">Contact the church</a> or <Link className="text-link" to="/register">visit registration</Link>.</p>
        </div>
    </div>;
}
