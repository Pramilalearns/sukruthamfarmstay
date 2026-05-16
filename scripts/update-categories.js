const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});
async function main() {
    const slugs = [
        'from-tensions-to-tenderness-sukruthams-ayurvedic-massage-experience',
        'digital-detox-why-a-farm-stay-in-trissur-is-the-perfect-way-to-unplug-and-recharge'
    ];
    for (const slug of slugs) {
        const post = await c.fetch(`*[_type=="post" && slug.current == $slug][0]{_id,title}`, { slug });
        if (!post) { console.log(`? Not found: ${slug}`); continue; }
        await c.patch(post._id).set({ category: 'Wellness' }).commit();
        console.log(`✓ [Wellness] ${post.title?.substring(0,60)}`);
    }
    console.log('Done!');
}
main().catch(console.error);
