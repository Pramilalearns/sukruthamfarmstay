const { createClient } = require('@sanity/client');
const c = createClient({
    projectId: '2lx5w0zi', 
    dataset: 'production',
    apiVersion: '2023-01-01', 
    useCdn: false
});

async function main() {
    const posts = await c.fetch(`*[_type == "post"]{_id, title, "oldCategory": category, "newRef": categoryRef->title}`);
    posts.forEach(p => {
        console.log(`Title: ${p.title}\nOld String: ${p.oldCategory}\nNew Ref: ${p.newRef}\n---`);
    });
}
main().catch(console.error);
