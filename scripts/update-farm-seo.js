const fs = require('fs');

const path = 'app/farm-stay-rooms/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. H1 Tag -> Farm Stay In Kerala (Heading case)
content = content.replace(
    '<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-stone-900 mb-4">\n                    Our Guest Rooms\n                </h1>',
    '<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-stone-900 mb-4">\n                    Farm Stay In Kerala\n                </h1>'
);

// Fallback if the raw exact match failed due to spacing:
if (!content.includes('Farm Stay In Kerala')) {
    content = content.replace('Our Guest Rooms', 'Farm Stay In Kerala');
}

// 2. farm stay in Kerala -> 3 times (sentence case)
content = content.replace(
    'Find Your Perfect Space — At Sukrutham Farm House in Thrissur',
    'Find Your Perfect Space — At the finest farm stay in Kerala'
);

content = content.replace(
    'Take a closer look at the unique character and crafted details of each of our guest rooms.',
    'Take a closer look at the unique character and crafted details of each of our guest rooms at our farm stay in Kerala.'
);

content = content.replace(
    'where every booking envelopes you in these premium inclusions',
    'where every booking at our farm stay in Kerala envelopes you in these premium inclusions'
);

// 3. farmhouse in Kerala -> 2 times (sentence case)
content = content.replace(
    'Here, the charm of rural Kerala blends beautifully with thoughtful comforts',
    'Here at our farmhouse in Kerala, the charm of rural life blends beautifully with thoughtful comforts'
);

content = content.replace(
    'Our spacious rooms combine traditional farmhouse aesthetics with modern comfort.',
    'Our spacious rooms combine traditional aesthetics with modern comfort, making us a premier farmhouse in Kerala.'
);

// 4. farm house in Thrissur -> 2 times (sentence case)
content = content.replace(
    'Your booking isn\'t just a room; it’s a beautifully curated experience.',
    'Your booking isn\'t just a room; it’s a beautifully curated experience at our farm house in Thrissur.'
);

content = content.replace(
    'Sukrutham Farmstay offers an experience that feels warm, authentic, and deeply refreshing.',
    'Sukrutham Farmstay, a leading farm house in Thrissur, offers an experience that feels warm, authentic, and deeply refreshing.'
);


// Write it back
fs.writeFileSync(path, content);

// Verification:
function countRegex(str, pattern) {
    const rx = new RegExp(pattern, 'g');
    const matches = str.match(rx);
    return matches ? matches.length : 0;
}

console.log('--- Verification Counts ---');
console.log('Farm Stay In Kerala (H1 exact):', countRegex(content, 'Farm Stay In Kerala'));
console.log('farm stay in Kerala:', countRegex(content, 'farm stay in Kerala'));
console.log('farmhouse in Kerala:', countRegex(content, 'farmhouse in Kerala'));
console.log('farm house in Thrissur:', countRegex(content, 'farm house in Thrissur'));

