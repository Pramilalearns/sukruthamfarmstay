(async () => {
    try {
        const Jimp = require('jimp');
        // Handle both default export and named export
        const jimpInstance = Jimp.Jimp || Jimp;
        const image = await jimpInstance.read('C:\\Users\\Pramila S\\Downloads\\Vihaan contructions Website\\logo files\\Color Code - Vihaan Constructions.png');
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        
        const colorCounts = {};
        for (let y = 0; y < height; y += 5) {
            for (let x = 0; x < width; x += 5) {
                const hex = image.getPixelColor(x, y).toString(16).toUpperCase();
                let padded = hex.padStart(8, '0');
                const rgb = '#' + padded.substring(0, 6);
                
                // Skip very close to white/black
                if (rgb !== '#FFFFFF' && rgb !== '#000000' && rgb !== '#FEFEFE' && rgb !== '#010101') {
                    colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
                }
            }
        }
        
        const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
        console.log('Top colors found (hex):');
        for (let i = 0; i < Math.min(10, sorted.length); i++) {
            console.log(sorted[i][0], 'Count:', sorted[i][1]);
        }
    } catch (err) {
        console.error('Error reading image:', err);
    }
})();
