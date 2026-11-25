import React, { useState } from 'react';

const accountNumber = '1010761266';

export default function BankDetailsCard() {
    const [copyStatus, setCopyStatus] = useState('');

    async function copyNumber() {
        try {
            await navigator.clipboard.writeText(accountNumber);
            setCopyStatus('Account number copied.');
        } catch {
            setCopyStatus('Copy is unavailable. Select the account number above to copy it manually.');
        }
    }

    return (
        <section className="surface bank-card">
            <h2>Bank Transfer Details</h2>
            <dl>
                <div className="bank-number"><dt>Account Number</dt><dd>{accountNumber}</dd></div>
                <div><dt>Account Name</dt><dd>Sabo Foursquare Gospel Church</dd></div>
                <div><dt>Bank Name</dt><dd>Zenith Bank PLC</dd></div>
                <div><dt>Description/narration</dt><dd>Love at Christmas</dd></div>
            </dl>
            <button className="button" type="button" onClick={copyNumber}>Copy account number</button>
            <p className="copy-feedback" role="status">{copyStatus}</p>
            <p className="transfer-note"><strong>Important:</strong> Please include <strong>"Love at Christmas"</strong> as your transfer description/narration</p>
        </section>
    );
}
