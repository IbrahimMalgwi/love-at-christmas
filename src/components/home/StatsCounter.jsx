import React from 'react';
import { impactFields } from '../../services/campaign';

export default function StatsCounter({ impact, loading }) {
    const figures = impactFields.filter(([key]) => Number.isSafeInteger(impact?.[key]) && impact[key] >= 0);
    return (
        <section className="impact-band">
            <div className="site-wrap impact-layout">
                <div>
                    <p className="eyebrow">Our impact</p>
                    <h2>Love in action.</h2>
                </div>
                {figures.length ? <dl className="impact-figures">
                    {figures.map(([key, label]) => <div key={key}>
                        <dt>{label}</dt><dd>{impact[key].toLocaleString()}</dd>
                    </div>)}
                </dl> : <p role="status">{loading ? 'Loading impact figures…' : 'Verified impact figures are currently unavailable.'}</p>}
            </div>
        </section>
    );
}
