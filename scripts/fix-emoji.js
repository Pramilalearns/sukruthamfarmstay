const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});

// Strips keycap emoji (1️⃣2️⃣...🔟) and all other emoji from text
function stripEmoji(text) {
    return text
        // Keycap sequences like 1️⃣ (digit + variation selector + combining enclosing keycap)
        .replace(/\d+\uFE0F\u20E3/g, '')
        // 🔟 (U+1F51F)
        .replace(/\uD83D\uDD1F/g, '')
        // Any remaining emoji in ranges
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[\u{2600}-\u{27BF}]/gu, '')
        // Variation selectors (FE0F) and combining enclosing keycap (20E3)
        .replace(/\uFE0F|\u20E3/g, '')
        .trim();
}

async function main() {
    const post = await c.fetch(
        `*[_type=="post" && slug.current=="top-10-things-about-the-puthur-zoological-park-in-thrissur"][0]{_id, body}`
    );
    
    let changed = false;
    const newBody = post.body.map(block => {
        if (block._type === 'block' && block.children) {
            const newChildren = block.children.map(child => {
                if (typeof child.text === 'string') {
                    const cleaned = stripEmoji(child.text);
                    if (cleaned !== child.text) {
                        console.log(`  Cleaned: "${child.text}" → "${cleaned}"`);
                        changed = true;
                        return { ...child, text: cleaned };
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
        console.log('✓ Emoji cleaned from content!');
    } else {
        console.log('No emoji found — nothing changed.');
    }
}
main().catch(console.error);
