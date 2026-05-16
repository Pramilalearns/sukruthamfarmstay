const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});
async function main() {
    const post = await c.fetch(`*[_type=="post" && slug.current=="top-10-things-about-the-puthur-zoological-park-in-thrissur"][0]{_id, body}`);
    post.body.forEach((b, i) => {
        if (b.style && b.style.startsWith('h')) {
            console.log(`Block ${i} [${b.style}]: "${b.children.map(c => c.text).join('')}"`);
        }
    });
}
main().catch(console.error);
