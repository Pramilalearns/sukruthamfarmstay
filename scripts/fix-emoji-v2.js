const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});

// Replaces keycap emoji with plain text numbers (e.g., 1️⃣ -> 1.)
function fixEmoji(text) {
    if (!text) return text;
    let result = text;
    
    // Replace 🔟 (U+1F51F) with 10.
    result = result.replace(/\uD83D\uDD1F/g, '10. ');
    
    // Replace keycap sequences 1️⃣ to 9️⃣ with "N. "
    // Note: The digit is followed by \uFE0F (variation selector) and \u20E3 (combining enclosing keycap)
    result = result.replace(/(\d)\uFE0F\u20E3/g, '$1. ');
    
    // Strip other decorative emojis but keep the text
    result = result.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    result = result.replace(/[\u{2600}-\u{27BF}]/gu, '');
    
    // Clean up double spaces that might have been created
    result = result.replace(/\s\s+/g, ' ').trim();
    
    return result;
}

async function main() {
    // Fetch the post again (need to get the content after my previous destructive run)
    // Actually, I should probably fetch ALL posts to see if others have this.
    const posts = await c.fetch(`*[_type=="post" && (body[].children[].text match "️⃣" || body[].children[].text match "🔟")]`);
    
    console.log(`Found ${posts.length} posts with keycap emojis.`);

    for (const post of posts) {
        console.log(`Processing post: ${post.title}`);
        let changed = false;
        const newBody = post.body.map(block => {
            if (block._type === 'block' && block.children) {
                const newChildren = block.children.map(child => {
                    if (typeof child.text === 'string') {
                        const fixed = fixEmoji(child.text);
                        if (fixed !== child.text) {
                            console.log(`  Fixed: "${child.text}" → "${fixed}"`);
                            changed = true;
                            return { ...child, text: fixed };
                        }
                    }
                    return child;
                });
                return { ...block, children: newChildren };
            }
            return block;
        });

        if (changed) {
            await c.patch(post._id).set({ body: newBody }).commit();
            console.log(`✓ Updated: ${post.title}`);
        }
    }
}
main().catch(console.error);
