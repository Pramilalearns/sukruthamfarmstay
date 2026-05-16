const { createClient } = require('@sanity/client');

const c = createClient({
    projectId: '2lx5w0zi', 
    dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', 
    useCdn: false
});

const categories = [
    "Host’s Journal",
    "Farm Life",
    "Food & Culture",
    "Heritage Architecture",
    "Rural Activities",
    "Wellness",
    "Local Sightseeing",
    "Nature’s Calendar",
    "Workcation & Retreats",
    "Sukrutham Highlights",
    "Guest Stories"
];

async function main() {
    for (const title of categories) {
        // Generate a friendly id
        const _id = 'category-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        const doc = {
            _id,
            _type: 'category',
            title: title,
            description: `Posts related to ${title}`
        };
        
        await c.createIfNotExists(doc);
        console.log(`✓ Added Category: ${title}`);
    }
    console.log('Finished adding all categories!');
}

main().catch(console.error);
