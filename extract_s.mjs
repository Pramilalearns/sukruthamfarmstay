import sharp from 'sharp';

async function process() {
    try {
        const img = sharp('public/logo/logo.png').trim();
        const { info, data } = await img.toBuffer({ resolveWithObject: true });
        console.log("Trimmed size:", info.width, info.height);
        
        // The icon is usually on the left and roughly square
        // We'll extract a square based on the height
        const size = info.height;
        
        await sharp(data)
            .extract({ left: 0, top: 0, width: size, height: size })
            .toFile('app/icon.png');
            
        console.log("Extracted successfully to app/icon.png");
    } catch (e) {
        console.error("Error:", e);
    }
}
process();
