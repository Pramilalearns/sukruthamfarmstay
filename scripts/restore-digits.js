const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});
async function main() {
    const post = await c.fetch(`*[_type=="post" && slug.current=="top-10-things-about-the-puthur-zoological-park-in-thrissur"][0]`);
    if (!post) { console.log('Post not found'); return; }
    
    let counter = 1;
    const newBody = post.body.map(block => {
        if (block.style && block.style.startsWith('h') && block.children && block.children[0]) {
            const text = block.children[0].text;
            // The headings are things like "Why...", "The Majestic..."
            // We want them to be "1. Why...", "2. The Majestic..."
            // But skip "Visitor Tips...", "A Weekend to Remember...", "FAQ", "Conclusion"
            if (counter <= 10 && !['Visitor Tips', 'A Weekend', 'FAQ', 'Conclusion'].some(skip => text.includes(skip))) {
                const newText = `${counter}. ${text}`;
                console.log(`Heading fixed: "${text}" → "${newText}"`);
                counter++;
                const newChildren = [...block.children];
                newChildren[0] = { ...newChildren[0], text: newText };
                return { ...block, children: newChildren };
            }
        }
        return block;
    });

    await c.patch(post._id).set({ body: newBody }).commit();
    console.log('✓ Digits restored to Puthur Zoo blog headings.');
}
main().catch(console.error);
