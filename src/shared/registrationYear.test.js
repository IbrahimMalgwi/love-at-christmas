import { currentRegistrationYear, registrationYear } from './registrationYear.mjs';

test('starts the year at midnight in Lagos', () => {
    expect(currentRegistrationYear(new Date('2025-12-31T22:59:59Z'))).toBe(2025);
    expect(currentRegistrationYear(new Date('2025-12-31T23:00:00Z'))).toBe(2026);
});

test('separates legacy records by their registration date and respects explicit campaign years', () => {
    expect(registrationYear({ created_at: '2025-12-13T10:00:00Z' })).toBe(2025);
    expect(registrationYear({ createdAt: { toDate: () => new Date('2026-11-26T09:00:00Z') } })).toBe(2026);
    expect(registrationYear({ campaignYear: 2025, createdAt: '2026-11-26T09:00:00Z' })).toBe(2025);
    expect(registrationYear({ created_at: 'invalid' })).toBeNull();
});
