const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { createClient } = require('@sanity/client');
const { JSDOM } = require('jsdom');
const blockTools = require('@sanity/block-tools');
const { Schema } = require('@sanity/schema');

const client = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});

const defaultSchema = Schema.compile({
    name: 'myBlog', types: [{
        type: 'object', name: 'blogPost',
        fields: [{ title: 'Body', name: 'body', type: 'array', of: [{ type: 'block' }] }]
    }]
});
const blockContentType = defaultSchema.get('blogPost').fields.find(f => f.name === 'body').type;

async function uploadImageFromUrl(url) {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) return null;
        const buffer = await res.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(buffer), {
            filename: path.basename(url.split('?')[0])
        });
        return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    } catch (e) {
        console.log('  Image upload failed:', url.substring(0, 60), '-', e.message);
        return null;
    }
}

// Split HTML at img tags and convert each segment
async function htmlToBlocksWithImages(html) {
    const blocks = [];

    // Split HTML at every <img> tag boundary
    const parts = html.split(/(<img\s[^>]*>|<img\s*\/>)/gi);

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Check if this part is an img tag
        if (/^<img\s/i.test(trimmed)) {
            const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
            const altMatch = trimmed.match(/alt=["']([^"']*)["']/i);
            if (srcMatch) {
                const imgUrl = srcMatch[1];
                // Only process non-emoji, non-data URLs
                if (!imgUrl.startsWith('data:') && imgUrl.startsWith('http')) {
                    console.log('  Uploading inline image:', imgUrl.substring(0, 70));
                    const imgBlock = await uploadImageFromUrl(imgUrl);
                    if (imgBlock) {
                        if (altMatch) imgBlock.alt = altMatch[1];
                        blocks.push(imgBlock);
                    }
                }
            }
        } else {
            // Convert HTML text section to blocks
            try {
                const textBlocks = blockTools.htmlToBlocks(trimmed, blockContentType, {
                    parseHtml: html => new JSDOM(html).window.document
                });
                blocks.push(...textBlocks);
            } catch (e) {
                // skip invalid segments
            }
        }
    }
    return blocks;
}

const xmlFilePath = path.join(__dirname, 'public', 'sukruthamfarmstayblog.WordPress.2026-04-06.xml');
const xmlData = fs.readFileSync(xmlFilePath, 'utf8');

const parser = new xml2js.Parser();
parser.parseString(xmlData, async (err, result) => {
    if (err) { console.error(err); return; }

    const channel = result.rss.channel[0];
    const items = channel.item || [];
    const posts = items.filter(i => i['wp:post_type']?.[0] === 'post' && i['wp:status']?.[0] === 'publish');

    console.log(`Re-migrating body content with images for ${posts.length} posts...`);

    for (const post of posts) {
        let title = (post.title?.[0] || '').replace(/<[^>]+>/g, '').trim();
        const slugStr = post['wp:post_name']?.[0] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const htmlContent = post['content:encoded']?.[0] || '';

        console.log(`\nProcessing: ${title}`);

        const bodyBlocks = await htmlToBlocksWithImages(htmlContent);
        console.log(`  => ${bodyBlocks.length} blocks (${bodyBlocks.filter(b => b._type === 'image').length} images)`);

        const docId = 'wp-imported-' + slugStr;
        try {
            await client.patch(docId).set({ body: bodyBlocks }).commit();
            console.log(`  Patched: ${docId}`);
        } catch (e) {
            console.error(`  Failed to patch ${docId}:`, e.message);
        }
    }
    console.log('\nAll posts updated with inline images!');
});
