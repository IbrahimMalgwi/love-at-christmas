import "@testing-library/jest-dom";
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import RegistrationsManager from './RegistrationsManager';
import { collections, firestoreService } from '../../services/firestore';
import { currentRegistrationYear } from '../../shared/registrationYear.mjs';

jest.mock('../../services/firestore', () => ({
    collections: { VOLUNTEERS: 'volunteers', PARTICIPANTS: 'participants' },
    firestoreService: { getAll: jest.fn() }
}));

test('filters both lists by year and opens the selected registration details', async () => {
    const year = currentRegistrationYear();
    firestoreService.getAll.mockImplementation(async collection => collection === collections.VOLUNTEERS ? [
        { id: 'current-volunteer', full_name: 'Current Volunteer', campaignYear: year, additional_comments: 'Current details' },
        { id: 'past-volunteer', full_name: 'Past Volunteer', created_at: `${year - 1}-12-13T10:00:00Z`, additional_comments: 'Past details' }
    ] : [
        { id: 'current-participant', full_name: 'Current Participant', campaignYear: year },
        { id: 'past-participant', full_name: 'Past Participant', campaignYear: year - 1, age: 0, special_needs: 'Participant details' }
    ]);

    render(<RegistrationsManager />);
    await screen.findByRole('button', { name: 'View details for Current Participant' });
    fireEvent.click(screen.getByRole('button', { name: /Volunteers/ }));
    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.showModal = () => { dialog.setAttribute('open', ''); };
    dialog.close = () => {
        dialog.removeAttribute('open');
        fireEvent(dialog, new Event('close', { bubbles: true }));
    };

    fireEvent.change(screen.getByLabelText('Campaign year'), { target: { value: String(year - 1) } });
    expect(screen.queryByRole('button', { name: 'View details for Current Volunteer' })).toBeNull();

    const volunteerButton = screen.getByRole('button', { name: 'View details for Past Volunteer' });
    fireEvent.click(volunteerButton);
    expect(within(dialog).getByText('Past details')).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(volunteerButton).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: /Participants/ }));
    expect(screen.queryByRole('button', { name: 'View details for Current Participant' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'View details for Past Participant' }));
    expect(within(dialog).getByText('Participant details')).toBeTruthy();
    expect(within(dialog).getByText('0')).toBeTruthy();
});

test('groups current, previous, and undated participants by default', async () => {
    firestoreService.getAll.mockImplementation(async collection => collection === collections.PARTICIPANTS ? [
        { id: 'past', full_name: 'Past Participant', created_at: '2025-12-13T10:00:00Z' },
        { id: 'current', full_name: 'Current Participant', campaignYear: 2026 },
        { id: 'undated', full_name: 'Undated Participant' }
    ] : []);

    render(<RegistrationsManager />);
    const table = await screen.findByRole('table');

    expect(screen.getByLabelText('Campaign year')).toHaveValue('all');
    const [, current, past, undated] = within(table).getAllByRole('rowgroup');
    expect(current).toHaveTextContent('2026');
    expect(current).toHaveTextContent('Current Participant');
    expect(past).toHaveTextContent('2025');
    expect(past).toHaveTextContent('Past Participant');
    expect(undated).toHaveTextContent('Undated records');
    expect(undated).toHaveTextContent('Undated Participant');
});
