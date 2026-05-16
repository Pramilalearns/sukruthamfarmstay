const fs = require('fs');
const path = 'app/homestay-in-thrissur/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Home Stay In Thrissur (Keep H1 intact, lowercase the rest)
// First, safely replace all Home Stay In Thrissur
content = content.replace(/Home Stay In Thrissur/g, 'home stay in Thrissur');
// Then restore the H1 tag explicitly
content = content.replace(
    '<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-stone-900 mb-4">\n                    home stay in Thrissur\n                </h1>',
    '<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-stone-900 mb-4">\n                    Home Stay In Thrissur\n                </h1>'
);

// 2. Stay in Thrissur
content = content.replace(/Stay in Thrissur/g, 'stay in Thrissur');

// 3. Best Homestay in Thrissur
content = content.replace(/Best Homestay in Thrissur/g, 'best homestay in Thrissur');
// But if it starts a sentence/clause like "The best homestay in Thrissur" it's ok. Wait, the original was "The Best Homestay in Thrissur"
content = content.replace(/The best homestay in Thrissur/g, 'The best homestay in Thrissur'); // the prompt said exactly the keyword should be lowercase except place. "The" is not strictly part of the keyword but is capitalized as part of the sentence.

// 4. Homestay in Thrissur Kerala
// We previously had: "A Premier Homestay in Thrissur Kerala" 
content = content.replace(/Homestay in Thrissur Kerala/g, 'homestay in Thrissur Kerala');
// Fix preceding word capitalization if it looks weird, e.g. "A Premier homestay" -> "A premier homestay" 
content = content.replace(/A Premier homestay/g, 'A premier homestay');

// 5. Homestay in Thrissur
content = content.replace(/Homestay in Thrissur/g, 'homestay in Thrissur');

// 6. Home Stay Thrissur
content = content.replace(/Home Stay Thrissur/g, 'home stay Thrissur');

// 7. Thrissur homestay -> already correct 'Thrissur homestay'

fs.writeFileSync(path, content);
console.log("Casing updated in homestay-in-thrissur/page.tsx!");
