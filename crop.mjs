import sharp from 'sharp';

async function crop() {
    try {
        await sharp('public/logo/logo.png')
            .trim()
            .toFile('public/logo/logo.png.new');
        
        console.log("Cropped successfully");
    } catch (e) {
        console.error("Error:", e);
    }
}
crop();
