import sys
try:
    from PIL import Image
    img = Image.open('public/logo/logo.png')
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        cropped.save('public/logo/logo.png')
        print("Cropped successfully to:", bbox)
    else:
        print("Image is empty")
except Exception as e:
    print("Error:", e)
