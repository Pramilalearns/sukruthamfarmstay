const { createClient } = require('@sanity/client');

const c = createClient({
    projectId: '2lx5w0zi', 
    dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', 
    useCdn: false
});

async function main() {
    console.log("Fetching Categories...");
    const categories = await c.fetch(`*[_type == "category"]{_id, title}`);
    
    // Create map holding straight and curly apostrophe versions just in case
    const catMap = {};
    categories.forEach(cat => {
        catMap[cat.title.toLowerCase()] = cat._id;
        // Map Nature's to Nature’s etc.
        const alternate = cat.title.toLowerCase().replace(/’/g, "'");
        catMap[alternate] = cat._id;
    });

    console.log("Fetching Posts...");
    const posts = await c.fetch(`*[_type == "post"]{_id, title, category}`);
    
    for (const post of posts) {
        if (!post.category) continue; // No old string category attached

        const lookupKey = post.category.toLowerCase();
        const matchedCatId = catMap[lookupKey];

        if (matchedCatId) {
            await c.patch(post._id).set({
                categoryRef: {
                    _type: 'reference',
                    _ref: matchedCatId
                }
            }).commit();
            console.log(`✓ Re-mapped: ${post.title} -> ${post.category}`);
        } else {
            console.log(`? Could not map old categorgy string: '${post.category}' for post: ${post.title}`);
        }
    }

    console.log("Re-mapping Complete!");
}

main().catch(console.error);
