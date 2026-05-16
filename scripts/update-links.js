const fs = require('fs');

const files = [
    'app/experience/activities/page.tsx',
    'components/Footer.tsx',
    'components/Navbar.tsx',
    'components/Rooms.tsx',
    'components/FloatingCTA.tsx',
    'components/Hero.tsx',
    'app/page.tsx'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let updated = content.replace(/href="\/rooms"/g, 'href="/farm-stay-rooms"');
        updated = updated.replace(/href='\/rooms'/g, "href='/farm-stay-rooms'");
        if (content !== updated) {
            fs.writeFileSync(file, updated);
            console.log(`Updated ${file}`);
        }
    }
}
