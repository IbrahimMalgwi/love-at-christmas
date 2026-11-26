const yearFormat = new Intl.DateTimeFormat('en-NG', { timeZone: 'Africa/Lagos', year: 'numeric' });

function currentRegistrationYear(date = new Date()) {
    return Number(yearFormat.format(date));
}

function registrationDate(record) {
    for (const value of [record.createdAt, record.created_at]) {
        if (value == null) continue;
        const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
        if (!Number.isNaN(date.getTime())) return date;
    }
    return null;
}

function registrationYear(record) {
    if (Number.isInteger(record.campaignYear)) return record.campaignYear;
    const date = registrationDate(record);
    return date ? currentRegistrationYear(date) : null;
}

export { currentRegistrationYear, registrationDate, registrationYear };
