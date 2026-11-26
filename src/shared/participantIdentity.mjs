function normalizePhone(phone) {
    if (typeof phone !== 'string') return null;
    const digits = phone.replace(/[\s().-]/g, '');
    if (/^0\d{10}$/.test(digits)) return '+234' + digits.slice(1);
    if (/^\+?234\d{10}$/.test(digits)) return '+' + digits.replace(/^\+/, '');
    return null;
}

async function participantKey(fullName, phone, crypto) {
    const name = typeof fullName === 'string'
        ? fullName.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()
        : '';
    const number = normalizePhone(phone);
    if (!name || !number) return null;
    const bytes = new TextEncoder().encode(JSON.stringify([name, number]));
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

export { normalizePhone, participantKey };
