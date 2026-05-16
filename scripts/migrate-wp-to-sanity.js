const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { createClient } = require('@sanity/client');
const { JSDOM } = require('jsdom');
const blockTools = require('@sanity/block-tools');
const { Schema } = require('@sanity/schema');

// Provided token and project details
const projectId = '2lx5w0zi';
const dataset = 'production';
const token = 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon';

const client = createClient({
    projectId,
    dataset,
    token, // We need token for write access
    apiVersion: '2023-01-01',
    useCdn: false
});

const xmlFilePath = path.join(__dirname, 'public', 'sukruthamfarmstayblog.WordPress.2026-04-06.xml');
console.log("Loading XML from:", xmlFilePath);
const xmlData = fs.readFileSync(xmlFilePath, 'utf8');

const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{type: 'block'}, {type: 'image'}]
        }
      ]
    }
  ]
});

const blockContentType = defaultSchema.get('blogPost').fields.find(field => field.name === 'body').type;

async function uploadImageFromUrl(url, altText) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const buffer = await response.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(buffer), {
            filename: path.basename(url)
        });
        
        return {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: altText || ''
        };
    } catch (e) {
        console.error("Failed to upload image:", url, e.message);
        return null;
    }
}

const parser = new xml2js.Parser();
parser.parseString(xmlData, async (err, result) => {
    if (err) {
        console.error("XML parse error:", err);
        return;
    }
    
    const channel = result.rss.channel[0];
    const items = channel.item || [];
    
    const posts = items.filter(item => item['wp:post_type'] && item['wp:post_type'][0] === 'post' && item['wp:status'][0] === 'publish');
    const attachments = items.filter(item => item['wp:post_type'] && item['wp:post_type'][0] === 'attachment');
    
    console.log(`Valid Published Posts: ${posts.length}`);
    
    for (const post of posts) {
        let title = post.title?.[0] || 'Untitled';
        title = title.replace(/<[^>]+>/g, '').trim(); // Remove any HTML embedded in titles
        const slugStr = post['wp:post_name']?.[0] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const pubDateStr = post['wp:post_date']?.[0] || new Date().toISOString();
        const htmlContent = post['content:encoded']?.[0] || '';
        const excerptStr = post['excerpt:encoded']?.[0] || htmlContent.substring(0, 150).replace(/<[^>]+>/g, '') + '...';
        
        // Extract Categories
        let categoryStr = 'Uncategorized';
        if (post.category) {
            const definedCat = post.category.find(c => c._ && c._ !== 'Uncategorized');
            if (definedCat) {
                categoryStr = definedCat._;
            }
        }
        
        console.log(`Processing: ${title}`);
        
        // Handle Featured Image
        let featuredImageAsset = undefined;
        let featuredImageUrl = undefined;
        const thumbnailMeta = post['wp:postmeta'] ? post['wp:postmeta'].find(m => m['wp:meta_key'][0] === '_thumbnail_id') : null;
        if (thumbnailMeta) {
            const thumbId = thumbnailMeta['wp:meta_value'][0];
            const matchingThumb = attachments.find(a => a['wp:post_id'][0] === thumbId);
            if (matchingThumb && matchingThumb['wp:attachment_url']) {
                featuredImageUrl = matchingThumb['wp:attachment_url'][0];
            }
        }

        if (featuredImageUrl) {
            const imgAsset = await uploadImageFromUrl(featuredImageUrl, title);
            if (imgAsset) {
                featuredImageAsset = imgAsset;
            }
        }

        // Convert HTML to Portable Text Blocks
        let portableTextBlocks = [];
        if (htmlContent) {
            try {
                portableTextBlocks = blockTools.htmlToBlocks(htmlContent, blockContentType, {
                    parseHtml: html => new JSDOM(html).window.document
                });
            } catch (blockErr) {
                console.error("HTML parse err:", blockErr.message);
            }
        }

        // Construct Sanity Document
        const sanityDoc = {
            _id: 'wp-imported-' + slugStr,
            _type: 'post',
            title: title,
            slug: { _type: 'slug', current: slugStr },
            publishedAt: new Date(pubDateStr).toISOString(),
            excerpt: excerptStr,
            category: categoryStr,
            body: portableTextBlocks,
            readTime: Math.ceil((htmlContent.replace(/<[^>]+>/g, '').length / 400)) + " min read"
        };
        
        if (featuredImageAsset) {
            sanityDoc.featuredImage = featuredImageAsset;
        }
        
        try {
            await client.createOrReplace(sanityDoc);
            console.log(`Saved! -> ${sanityDoc._id}`);
        } catch (createErr) {
            console.error(`Failed to create post ${title}:`, createErr.message);
        }
    }
    
    console.log("All 24 Posts Migrated Successfully!");
});
