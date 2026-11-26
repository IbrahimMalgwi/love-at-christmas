import { csvService, importSchemas } from './csvService';

jest.mock('../firebase/config', () => ({ db: {} }));

function file(text) {
    return { size: text.length, text: async () => text };
}

test('keeps quoted values and converts inventory quantities to numbers', async () => {
    const csv = 'item_name,category,quantity_needed,unit_price\n"Rice, bag",food,10,25\n';
    await expect(csvService.parseCSV(file(csv), importSchemas.items_inventory)).resolves.toEqual([
        { item_name: 'Rice, bag', category: 'food', quantity_needed: 10, unit_price: 25, quantity_received: 0 }
    ]);
});

test('rejects invalid numeric fields before starting a write', async () => {
    const csv = 'item_name,category,quantity_needed,unit_price\nRice,food,-1,25\n';
    await expect(csvService.parseCSV(file(csv), importSchemas.items_inventory)).rejects.toThrow('invalid quantity_needed');
});
