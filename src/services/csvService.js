import participantIdentity from '../shared/participantIdentity.cjs';
import Papa from 'papaparse';
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

const { participantKey } = participantIdentity;

export const importSchemas = {
    volunteers: {
        label: 'Volunteers',
        requiredFields: ['full_name', 'email', 'phone', 'church', 'role'],
        optionalFields: ['additional_comments']
    },
    participants: {
        label: 'Participants',
        requiredFields: ['full_name', 'phone', 'address', 'sex', 'age', 'religion'],
        optionalFields: ['special_needs'],
        numbers: { age: { integer: true, max: 120 } }
    },
    items_inventory: {
        label: 'Items Inventory',
        requiredFields: ['item_name', 'category', 'quantity_needed', 'unit_price'],
        optionalFields: ['quantity_received', 'description'],
        defaults: { quantity_received: 0 },
        numbers: { quantity_needed: {}, quantity_received: {}, unit_price: {} }
    },
    faqs: {
        label: 'FAQs',
        requiredFields: ['question', 'answer', 'category', 'order'],
        optionalFields: [],
        numbers: { order: { integer: true } }
    }
};

export const csvService = {
    async parseCSV(file, schema) {
        if (file.size > 1024 * 1024) throw new Error('CSV files must be 1 MB or smaller.');
        const { data, errors, meta } = Papa.parse(await file.text(), {
            header: true,
            skipEmptyLines: 'greedy',
            transformHeader: header => header.trim()
        });
        if (errors.length) throw new Error(errors[0].message);
        if (!data.length || data.length > 500) throw new Error('Import between 1 and 500 records at a time.');
        if (Object.keys(meta.renamedHeaders || {}).length) throw new Error('CSV headers must be unique.');

        const { requiredFields, optionalFields, defaults, numbers } = schema;
        const missing = requiredFields.filter(field => !meta.fields.includes(field));
        if (missing.length) throw new Error(`Missing required columns: ${missing.join(', ')}`);
        return data.map((row, index) => {
            const record = { ...defaults };
            for (const field of [...requiredFields, ...optionalFields]) {
                const value = row[field]?.trim();
                if (!value) {
                    if (requiredFields.includes(field)) throw new Error(`Record ${index + 1}: ${field} is required.`);
                    continue;
                }
                const numeric = numbers?.[field];
                if (!numeric) {
                    record[field] = value;
                    continue;
                }
                const number = Number(value);
                if (!Number.isFinite(number) || number < 0 || number > (numeric.max ?? Infinity)
                    || (numeric.integer && !Number.isInteger(number))) {
                    throw new Error(`Record ${index + 1}: invalid ${field}.`);
                }
                record[field] = number;
            }
            return record;
        });
    },

    async uploadCSVData(collectionName, records, onProgress) {
        const batch = writeBatch(db);
        const target = collection(db, collectionName);
        for (const record of records) {
            const registrationKey = collectionName === 'participants' ? await participantKey(record.full_name, record.phone, window.crypto) : null;
            batch.set(doc(target), {
                ...record,
                ...(registrationKey ? { registrationKey } : {}),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        await batch.commit();
        onProgress({ percentage: 100 });
        return { collection: collectionName, success: true, processed: records.length, totalRecords: records.length };
    },

    generateTemplate(requiredFields) {
        return Papa.unparse([requiredFields]);
    }
};
