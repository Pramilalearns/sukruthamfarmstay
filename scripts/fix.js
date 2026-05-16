const fs = require('fs');
let lines = fs.readFileSync('app/our-story/page.tsx', 'utf8').split('\n');

const heroStart = lines.findIndex(l => l.includes('const HERO_IMAGES = ['));
const trustSignals = lines.findIndex(l => l.includes('{/* --- Trust Signals & Awards --- */}'));

if (heroStart !== -1 && trustSignals !== -1 && heroStart < trustSignals) {
    const newLines = [
        'export default function OurStory() {',
        '    return (',
        '        <main className="min-h-screen bg-[#FDFCF8] selection:bg-primary/20 selection:text-primary-dark font-sans">',
        '            <Navbar />',
        '',
        '            <OurStoryHero />'
    ];
    lines.splice(heroStart, trustSignals - heroStart, ...newLines);
    fs.writeFileSync('app/our-story/page.tsx', lines.join('\n'));
    console.log('Fixed lines successfully');
} else {
    console.log('Could not find boundaries');
}
