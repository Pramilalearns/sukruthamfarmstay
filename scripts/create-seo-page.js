const fs = require('fs');
const content = fs.readFileSync('app/farm-stay-rooms/page.tsx', 'utf8');

let newContent = content;

// Replace exactly to get the counts for: 
// "Home Stay In Thrissur" - 4 (including h1)
newContent = newContent.replace(
    /<h1[^>]*>[\s\S]*?<\/h1>/,
    `<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-stone-900 mb-4">
                    Home Stay In Thrissur
                </h1>`
);
newContent = newContent.replace(
    'Take a closer look at the unique character and crafted details of each of our guest rooms.',
    'Take a closer look at the unique character and crafted details of each of our guest rooms at our Home Stay In Thrissur.'
);
newContent = newContent.replace(
    'Your booking isn\'t just a room; it’s a beautifully curated experience.',
    'Your booking isn\'t just a room; it’s a beautifully curated experience at our premium Home Stay In Thrissur.'
);
newContent = newContent.replace(
    'If you need to work while travelling, Sukrutham provides the best of both worlds.',
    'If you need to work while travelling, this Home Stay In Thrissur provides the best of both worlds.' // Note: I will split the second part below
);

// "Farm Stay in Thrissur" - 2
newContent = newContent.replace(
    'We thoughtfully design a holistic farmhouse experience in Kerala, where every booking envelopes you in these premium inclusions',
    'We thoughtfully design a holistic farmhouse experience in Kerala, where every booking at our Farm Stay in Thrissur envelopes you in these premium inclusions'
);
newContent = newContent.replace(
    'Perfect for comfort and connection.',
    'Perfect for comfort and connection at our Farm Stay in Thrissur.'
);

// "Homestay in Thrissur" - 2 (Make sure we don't accidentally match "Homestay in Thrissur Kerala" or "Best Homestay in Thrissur")
newContent = newContent.replace(
    'Sukrutham is designed with care for the environment.',
    'Sukrutham, an eco-friendly Homestay in Thrissur, is designed with care for the environment.'
);
newContent = newContent.replace(
    'As the sun sets, Sukrutham transforms into a magical retreat.',
    'As the sun sets, Sukrutham transforms into a magical retreat, embodying the essence of a serene Homestay in Thrissur.'
);

// "Home Stay Thrissur" - 2
newContent = newContent.replace(
    'Sukrutham Farmstay offers an experience that feels warm, authentic, and deeply refreshing.',
    'Sukrutham Farmstay, a leading Home Stay Thrissur, offers an experience that feels warm, authentic, and deeply refreshing.'
);
newContent = newContent.replace(
    'A stay here is incomplete without experiencing the flavors of Kerala.',
    'A stay here is incomplete without experiencing the flavors of Kerala at our Home Stay Thrissur.'
);

// "Best Homestay in Thrissur" - 2
newContent = newContent.replace(
    'Find Your Perfect Space — At Sukrutham Farm House in Thrissur',
    'Find Your Perfect Space — The Best Homestay in Thrissur'
);
newContent = newContent.replace(
    'Our most spacious room (180 sq.ft.), designed with a blend of traditional Kerala aesthetics and modern luxury.',
    'Our most spacious room (180 sq.ft.), designed with a blend of traditional Kerala aesthetics and modern luxury, making it the Best Homestay in Thrissur.'
);

// "Homestay in Thrissur Kerala" - 3
newContent = newContent.replace(
    'Why You Will Love Your Stay at Sukrutham',
    'Why You Will Love Your Stay - A Premier Homestay in Thrissur Kerala'
);
newContent = newContent.replace(
    'Sukrutham offers opportunities to slow down and immerse yourself in local life.',
    'This beautiful Homestay in Thrissur Kerala offers opportunities to slow down and immerse yourself in local life.'
);
newContent = newContent.replace(
    'Reliable high-speed internet ensures productivity',
    'As a top Homestay in Thrissur Kerala, reliable high-speed internet ensures productivity'
);

// "Thrissur homestay" - 1
newContent = newContent.replace(
    'From arranging farm tours and local experiences to assisting with transportation, our team ensures every guest feels welcomed',
    'From arranging farm tours and local experiences to assisting with transportation, our Thrissur homestay team ensures every guest feels welcomed'
);

if (!fs.existsSync('app/homestay-in-thrissur')) {
    fs.mkdirSync('app/homestay-in-thrissur', { recursive: true });
}
fs.writeFileSync('app/homestay-in-thrissur/page.tsx', newContent);

console.log("File created successfully.");

// Let's verify by just logging the matches
function countExact(str, toFind) {
    // Need a rough count to verify. We'll simply count how many times the substring occurs.
    // To distinguish "Homestay in Thrissur" from "Best Homestay in Thrissur" we could use a specific replacement marker, but since we explicitly wrote the replacements above, they correspond 1:1.
    return str.split(toFind).length - 1;
}

const keywords = [
    "Farm Stay in Thrissur",
    "Home Stay In Thrissur",
    "Homestay in Thrissur",
    "Home Stay Thrissur",
    "Best Homestay in Thrissur",
    "Homestay in Thrissur Kerala",
    "Thrissur homestay"
];

for (const kw of keywords) {
    let count = countExact(newContent, kw);
    // Adjustment for nested strings: "Homestay in Thrissur" is inside "Best Homestay in Thrissur" and "Homestay in Thrissur Kerala".
    if (kw === "Homestay in Thrissur") {
        count -= countExact(newContent, "Best Homestay in Thrissur");
        count -= countExact(newContent, "Homestay in Thrissur Kerala");
    }
    console.log(`Keyword "${kw}": ${count}`);
}
