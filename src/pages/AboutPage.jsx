import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="site-wrap section-spacing">
            <header className="page-heading">
                <p className="eyebrow">Foursquare Gospel Church Sabo.</p>
                <h1>About Love at Christmas</h1>
                <p>Love at Christmas is a Christmas outreach of Foursquare Gospel Church Sabo in Lagos.</p>
            </header>
            <div className="participation-grid">
                <article className="surface participation-card">
                    <h2>Our mission</h2>
                    <p>We share the love of Christ by providing essential items, warm clothing and nutritious food to families in need.</p>
                </article>
                <article className="surface participation-card">
                    <h2>Our community</h2>
                    <p>Through gifts, fellowship and prayer, we share the hope and joy of Christmas with our community.</p>
                </article>
            </div>
            <div className="button-row">
                <Link to="/donate" className="button">Make a donation</Link>
                <Link to="/gallery" className="button button-outline">See the outreach</Link>
            </div>
        </div>
    );
}
