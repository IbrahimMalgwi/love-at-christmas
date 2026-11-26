import React, { useEffect, useRef } from 'react';
import { registrationDate, registrationYear } from '../../shared/registrationYear.mjs';

const dateFormat = new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Lagos'
});

export default function RegistrationDetails({ selection, onClose }) {
    const dialog = useRef(null);
    useEffect(() => {
        if (selection && !dialog.current.open) dialog.current.showModal();
    }, [selection]);

    const record = selection?.record;
    const date = record && registrationDate(record);
    const fields = record && [
        ['Full name', record.full_name],
        ['Phone number', record.phone],
        ...(selection.type === 'Volunteer' ? [
            ['Email', record.email],
            ['Church or organisation', record.church],
            ['Volunteer role', record.role],
            ['Additional comments', record.additional_comments]
        ] : [
            ['Address', record.address],
            ['Sex', record.sex],
            ['Age', record.age],
            ['Religion', record.religion],
            ['Special needs', record.special_needs]
        ]),
        ['Campaign year', registrationYear(record)],
        ['Registered at (Lagos time)', date && dateFormat.format(date)]
    ];

    return (
        <dialog ref={dialog} className="photo-dialog registration-details" aria-labelledby="registration-details-title" onClose={onClose}>
            {selection && <>
                <div className="section-heading">
                    <h2 id="registration-details-title">{selection.type} registration details</h2>
                    <button type="button" className="button button-outline" onClick={() => dialog.current.close()}>Close</button>
                </div>
                <dl>
                    {fields.map(([label, value]) => <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value == null || value === '' ? 'Not provided' : String(value)}</dd>
                    </div>)}
                </dl>
            </>}
        </dialog>
    );
}
