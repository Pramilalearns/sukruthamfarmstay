const { createClient } = require('@sanity/client');

const c = createClient({
    projectId: '2lx5w0zi', 
    dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', 
    useCdn: false
});

const slugToCategory = {
    'capturing-the-magic-of-the-kerala-monsoon': 'Nature’s Calendar',
    'why-i-left-the-city-for-sukrutham': 'Host’s Journal',
    'secret-recipes-from-our-kitchen': 'Food & Culture',
    'the-cool-secrets-of-laterite-stone': 'Heritage Architecture',
    'finding-a-home-away-from-home': 'Guest Stories',
    'village-walks-and-pottery-art': 'Rural Activities',
    'the-season-of-rambutan-and-mangosteen': 'Farm Life',
    'the-philosophy-of-sukrutham': 'Host’s Journal',
    'organic-manuring-the-secret-to-our-greenery': 'Farm Life',
    'celebrating-onam-at-sukrutham': 'Food & Culture',
    'restoring-the-past-mud-plaster-techniques': 'Heritage Architecture',
    'a-trip-to-athirappilly-waterfalls': 'Rural Activities',
    'early-morning-birdwatching-guide': 'Nature’s Calendar',
    'newly-inaugurated-thrissur-zoological-park': 'Local Sightseeing',
    'hidden-monsoon-gems-vattayi-waterfalls': 'Local Sightseeing',
    'watching-the-sunrise-at-cheppara-rock-garden': 'Local Sightseeing',
    'monsoon-trails-at-peechi-wildlife-sanctuary': 'Local Sightseeing',
    'cultural-immersion-at-kerala-kalamandalam': 'Local Sightseeing',
    'spiritual-havens-vadakkumnathan-guruvayur': 'Local Sightseeing',
    'emerging-local-gems-ilanjippara-kollengode': 'Local Sightseeing',
    'backwaters-beaches-coastal-day-trips': 'Local Sightseeing',
    'chimmony-trekking-village-drive-routes': 'Local Sightseeing',
    'wp-imported-from-tensions-to-tenderness-sukruthams-ayurvedic-massage-experience': 'Wellness',
    'from-tensions-to-tenderness-sukruthams-ayurvedic-massage-experience': 'Wellness',
    'wp-imported-digital-detox-why-a-farm-stay-in-trissur-is-the-perfect-way-to-unplug-and-recharge': 'Wellness',
    'digital-detox-why-a-farm-stay-in-trissur-is-the-perfect-way-to-unplug-and-recharge': 'Wellness'
};

async function main() {
    console.log("Setting up Author: Sukrutham Team...");
    const authorDoc = {
        _id: 'author-sukrutham-team',
        _type: 'author',
        name: 'Sukrutham Team',
        slug: { current: 'sukrutham-team', _type: 'slug' }
    };
    await c.createIfNotExists(authorDoc);
    console.log("✓ Author ensured.");

    console.log("Fetching Categories...");
    const categories = await c.fetch(`*[_type == "category"]{_id, title}`);
    const catMap = {};
    categories.forEach(cat => {
        catMap[cat.title] = cat._id;
    });

    console.log("Fetching Posts...");
    const posts = await c.fetch(`*[_type == "post"]{_id, "slug": slug.current, title}`);
    
    for (const post of posts) {
        let slug = post.slug;
        if (!slug) continue;
        
        let targetCategoryTitle = slugToCategory[slug];
        // Handle prefix cases or mismatches
        if (!targetCategoryTitle) {
            const cleanSlug = slug.replace('wp-imported-', '');
            targetCategoryTitle = slugToCategory[cleanSlug];
        }
        
        // Fallback for old WP posts not on the new website list
        if (!targetCategoryTitle) {
            targetCategoryTitle = 'Sukrutham Highlights';
        }

        const patchData = {
            author: {
                _type: 'reference',
                _ref: 'author-sukrutham-team'
            }
        };

        if (targetCategoryTitle && catMap[targetCategoryTitle]) {
            patchData.categoryRef = {
                _type: 'reference',
                _ref: catMap[targetCategoryTitle]
            };
        } else {
            console.log(`? No exact category match for slug: ${slug}`);
        }

        await c.patch(post._id).set(patchData).commit();
        console.log(`✓ Updated Post: ${post.title}`);
    }

    console.log("Migration Complete!");
}

main().catch(console.error);
