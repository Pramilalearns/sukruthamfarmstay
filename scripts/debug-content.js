const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});
async function main() {
    const post = await c.fetch(`*[_type=="post" && slug.current=="top-10-things-about-the-puthur-zoological-park-in-thrissur"][0]{body}`);
    post.body.forEach((block, i) => {
        if (!block.listItem && block._type === 'block') {
            const text = block.children?.map(c => c.text).join('').substring(0, 80);
            console.log(`Block ${i} style=${block.style}: "${text}"`);
            // Show any marks with unusual keys
            block.children?.forEach(ch => {
                if (ch.marks?.length) {
                    const unusual = ch.marks.filter(m => !['strong','em','underline','code'].includes(m));
                    if (unusual.length) console.log(`  -> unusual marks: ${unusual}, markDefs:`, JSON.stringify(block.markDefs));
                }
            });
        }
    });
}
main().catch(console.error);
