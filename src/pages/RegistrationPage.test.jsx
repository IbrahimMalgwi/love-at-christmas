import "@testing-library/jest-dom";
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RegistrationPage from './RegistrationPage';
import useCampaign from '../hooks/useCampaign';
import { currentRegistrationYear } from '../shared/registrationYear.mjs';

jest.mock('../hooks/useCampaign');
jest.mock('../components/registration/ParticipantForm', () => () => <div>Participant form</div>);
jest.mock('../components/registration/VolunteerForm', () => () => <div>Volunteer form</div>);

const year = currentRegistrationYear();

test('offers both choices when only last year’s campaign was closed', () => {
    useCampaign.mockReturnValue({ campaign: { volunteerRegistrationYear: year - 1, volunteerOpen: false } });
    render(<RegistrationPage />);

    expect(screen.getByText('Participant form')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Volunteer' }));
    expect(screen.getByText('Volunteer form')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Participant' }));
    expect(screen.getByText('Participant form')).toBeTruthy();
});

test('honors the published volunteer closure for the current year', () => {
    useCampaign.mockReturnValue({ campaign: { volunteerRegistrationYear: year, volunteerOpen: false } });
    render(<RegistrationPage />);

    expect(screen.getByRole('button', { name: 'Volunteer' }).disabled).toBe(true);
    expect(screen.getByText('Participant form')).toBeTruthy();
});

test.each([
    { campaign: null, loading: true, error: false },
    { campaign: null, loading: false, error: true }
])('opens the volunteer form while campaign availability is unknown', state => {
    useCampaign.mockReturnValue(state);
    render(<RegistrationPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Volunteer' }));
    expect(screen.getByText('Volunteer form')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Registration form' })).toHaveFocus();
});
