import React, { useEffect, useRef, useState } from 'react';
import ParticipantForm from '../components/registration/ParticipantForm';
import VolunteerForm from '../components/registration/VolunteerForm';
import { currentRegistrationYear } from '../shared/registrationYear.mjs';
import useCampaign from '../hooks/useCampaign';

export default function RegistrationPage() {
    const { campaign, loading, error } = useCampaign();
    const [volunteer, setVolunteer] = useState(false);
    const formSection = useRef(null);
    const choiceChanged = useRef(false);
    const year = currentRegistrationYear();
    const closed = campaign?.volunteerRegistrationYear === year && campaign.volunteerOpen === false;
    const showVolunteer = !closed && volunteer;

    useEffect(() => {
        if (choiceChanged.current) {
            formSection.current.focus();
            choiceChanged.current = false;
        }
    }, [showVolunteer]);

    function selectRegistration(isVolunteer) {
        if (isVolunteer === showVolunteer) {
            formSection.current.focus();
            return;
        }
        choiceChanged.current = true;
        setVolunteer(isVolunteer);
    }

    return (
        <div className="site-wrap section-spacing registration-layout">
            <header className="page-heading">
                <p className="eyebrow">Take part</p>
                <h1>Register for Love at Christmas {year}</h1>
                <p>Register for a Christmas package or sign up as a volunteer.</p>
                <p className="registration-status" role="status">
                    {loading ? 'Checking volunteer registration…' : error ? 'We could not check volunteer availability. You can still open the form.' :
                        closed ? 'Volunteer registration is currently closed. Only participant registration is available.' : 'Volunteer registration is open.'}
                </p>
                <div className="button-row" aria-label="Registration type" role="group">
                    <button className="button button-outline" aria-pressed={!showVolunteer} type="button" aria-controls="registration-form" onClick={() => selectRegistration(false)}>Participant</button>
                    <button className="button button-outline" aria-pressed={showVolunteer} type="button" aria-controls="registration-form" disabled={closed} onClick={() => selectRegistration(true)}>Volunteer</button>
                </div>
            </header>
            <div className="surface registration-card" role="region" aria-label="Registration form" id="registration-form" ref={formSection} tabIndex={-1}>
                {showVolunteer ? <VolunteerForm /> : <ParticipantForm />}
            </div>
        </div>
    );
}
