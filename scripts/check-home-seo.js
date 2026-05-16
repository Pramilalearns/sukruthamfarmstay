const fs = require('fs');
const path = require('path');

const componentsToCheck = [
    'app/page.tsx',
    'components/Hero.tsx',
    'components/Welcome.tsx',
    'components/VideoBento.tsx',
    'components/AboutFAQ.tsx',
    'components/Experience.tsx',
    'components/TourGallery.tsx',
    'components/WhyChooseUs.tsx',
    'components/Testimonials.tsx',
    'components/Rooms.tsx',
    'components/News.tsx',
    'components/FAQ.tsx',
    'components/Metrics.tsx'
];

const targets = [
    'farmstay in kerala',
    'farm stay in kerala',
    'farmhouse',
    'homestay in thrissur',
    'a relaxing farmstay in kerala',
    'best home stay in kerala',
    'best homestay in kerala',
    'homestay in kerala',
    'home stay in kerala'
];

let results = {};

componentsToCheck.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8').toLowerCase();
    
    // Also store original case
    const origContent = fs.readFileSync(file, 'utf8');

    targets.forEach(t => {
        let regex = new RegExp(t, 'gi');
        let matches = origContent.match(regex);
        if (matches) {
            if (!results[file]) results[file] = [];
            results[file].push({ term: t, count: matches.length, matches: matches });
        }
    });
});

console.log(JSON.stringify(results, null, 2));
