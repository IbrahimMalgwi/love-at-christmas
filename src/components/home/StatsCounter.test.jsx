import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCounter from './StatsCounter';

jest.mock('../../firebase/config', () => ({ db: null }));

test('shows a verified zero and omits missing figures', () => {
    render(<StatsCounter impact={{ volunteers: 0 }} />);
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.queryByText('Participants registered')).toBeNull();
});

test('shows a status when no figures have been approved', () => {
    render(<StatsCounter />);
    expect(screen.getByText('Verified impact figures are currently unavailable.')).toBeTruthy();
});
