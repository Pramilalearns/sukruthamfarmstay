const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', dataset: 'production',
    token: 'skcucnHjj2TYa0rRr249BrCLdMBcbWrjOkOIafsNpDpzVKZ0j4dyhLpKiHDdxaMZ75mEjzZKsIkGcqNOXr7g2SNLZO1ZdvDdLmv64Cs1Rxk01UaY8Tlz0wETTzIWRFqC6TNFEmYzJkCxHPsVXkOmN4mamePoHsjAZZFcI5I9RYL6jShUyeon',
    apiVersion: '2023-01-01', useCdn: false
});
async function main() {
    const post = await c.fetch('*[_type=="post"][0]{title, body}');
    console.log('Post:', post.title);
    // Show all block types and any image blocks
    const blocks = post.body || [];
    const imageBlocks = blocks.filter(b => b._type === 'image');
    const blockTypes = [...new Set(blocks.map(b => b._type))];
    console.log('Total blocks:', blocks.length);
    console.log('Block types found:', blockTypes);
    console.log('Image blocks count:', imageBlocks.length);
    if (imageBlocks.length > 0) {
        console.log('Sample image block:', JSON.stringify(imageBlocks[0], null, 2));
    }
    // Check if any text blocks contain img references
    const textBlocks = blocks.filter(b => b._type === 'block');
    const withImg = textBlocks.filter(b => JSON.stringify(b).includes('img') || JSON.stringify(b).includes('image'));
    console.log('Text blocks referencing images:', withImg.length);
}
main().catch(console.error);
