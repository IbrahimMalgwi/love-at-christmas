import { firestoreService, collections } from '../services/firestore';

// Import your exported JSON data
const importedData = {
    items_inventory: require('./data/items_inventory.json'),
    volunteers: require('./data/volunteers.json'),
    participants: require('./data/participants.json'),
    faqs: require('./data/faqs.json'),
    gallery_categories: require('./data/gallery_categories.json'),
    gallery_images: require('./data/gallery_images.json'),
    items_received: require('./data/items_received.json'),
    admin_users: require('./data/admin_users.json')
};

const importData = async () => {
    console.log('Starting data import to Firebase...');

    for (const [collectionName, data] of Object.entries(importedData)) {
        if (!data || data.length === 0) {
            console.log(`Skipping empty collection: ${collectionName}`);
            continue;
        }

        console.log(`Importing ${data.length} records to ${collectionName}...`);

        let importedCount = 0;
        for (const item of data) {
            try {

                const { id, created_at, updated_at, ...itemData } = item;

                // Convert dates
                const formattedData = {
                    ...itemData,
                    createdAt: created_at ? new Date(created_at) : new Date(),
                    updatedAt: updated_at ? new Date(updated_at) : new Date()
                };

                await firestoreService.add(collections[collectionName.toUpperCase()], formattedData);
                importedCount++;

                if (importedCount % 10 === 0) {
                    console.log(`  Imported ${importedCount}/${data.length}...`);
                }
            } catch (error) {
                console.error(`Error importing item to ${collectionName}:`, error);
            }
        }

        console.log(`✅ Imported ${importedCount} records to ${collectionName}`);
    }

    console.log('🎉 Data import completed!');
};

// Run the import
importData();