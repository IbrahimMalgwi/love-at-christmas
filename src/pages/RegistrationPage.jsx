import React, { useState } from 'react';
import ParticipantForm from '../components/registration/ParticipantForm';
import VolunteerForm from '../components/registration/VolunteerForm';
import { currentRegistrationYear } from '../shared/registrationYear.mjs';
import useCampaign from '../hooks/useCampaign';

export default function RegistrationPage() {
    const { campaign, loading, error } = useCampaign();
    const [volunteer, setVolunteer] = useState(false);
    const year = currentRegistrationYear();
    const closed = campaign?.volunteerRegistrationYear === year && campaign.volunteerOpen === false;
    const open = !loading && !error && !closed;
    const showVolunteer = open && volunteer;

    return (
        <div className="site-wrap section-spacing registration-layout">
            <header className="page-heading">
                <p className="eyebrow">Take part</p>
                <h1>Register for Love at Christmas {year}</h1>
                <p>Register for a Christmas package or sign up as a volunteer.</p>
                <p className="registration-status" role="status">
                    {loading ? 'Checking volunteer registration…' : error ? 'Volunteer registration is currently unavailable.' :
                        open ? 'Volunteer registration is open.' : 'Volunteer registration is currently closed. Only participant registration is available.'}
                </p>
                <div className="button-row" aria-label="Registration type" role="group">
                    <button className="button button-outline" aria-pressed={!showVolunteer} onClick={() => setVolunteer(false)}>Participant</button>
                    <button className="button button-outline" aria-pressed={showVolunteer} disabled={!open} onClick={() => setVolunteer(true)}>Volunteer</button>
                </div>
            </header>
            <div className="surface registration-card">
                {showVolunteer ? <VolunteerForm /> : <ParticipantForm />}
            </div>
        </div>
    );
}
