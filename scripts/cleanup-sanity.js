const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});
async function main() {
    const posts = await c.fetch('*[_type=="post"]{_id,title}');
    console.log('Total posts:', posts.length);
    const toDelete = posts.filter(p => !p._id.startsWith('wp-imported-'));
    console.log('Deleting', toDelete.length, 'non-imported posts...');
    for (const p of toDelete) {
        await c.delete(p._id);
        console.log('Deleted:', p._id);
    }
    const remaining = await c.fetch('count(*[_type=="post"])');
    console.log('Remaining posts:', remaining);
}
main().catch(console.error);
