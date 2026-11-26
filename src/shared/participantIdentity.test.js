import { webcrypto } from 'node:crypto';
import { TextEncoder } from 'node:util';
import { normalizePhone, participantKey } from './participantIdentity.mjs';

beforeAll(() => { global.TextEncoder = TextEncoder; });

test('matches equivalent names and Nigerian phone formats', async () => {
    const local = await participantKey('  Ada   Okafor ', '0801 234 5678', webcrypto);
    const international = await participantKey('ADA OKAFOR', '+234-801-234-5678', webcrypto);
    expect(local).toEqual(international);
    expect(local).toHaveLength(64);
});

test('allows different names to share the same phone number', async () => {
    const first = await participantKey('Ada Okafor', '08012345678', webcrypto);
    const second = await participantKey('Ife Okafor', '08012345678', webcrypto);
    expect(first).not.toEqual(second);
});

test('rejects malformed phone numbers', () => {
    expect(normalizePhone('080123')).toBeNull();
});
