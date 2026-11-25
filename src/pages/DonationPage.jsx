import React from 'react';
import BankDetailsCard from '../components/donation/BankDetailsCard';

export default function DonationPage() {
    return (
        <div className="site-wrap section-spacing donation-layout">
            <header className="page-heading">
                <p className="eyebrow">Give this Christmas</p>
                <h1>Make a Donation</h1>
                <p>Your generous support helps us bring Christmas joy and essential items to families in need this holiday season.</p>
                <aside className="donation-note">
                    <h2>Transparency Statement</h2>
                    <p>We are committed to transparency in all our operations. All donations are properly accounted for and used exclusively for the Love at Christmas program.</p>
                </aside>
            </header>
            <BankDetailsCard />
        </div>
    );
}
