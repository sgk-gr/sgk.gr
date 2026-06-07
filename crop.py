from PIL import Image

img = Image.open('public/11.png')
# Original size 1200x1200. Crop to 1200x628 (center).
# Top: (1200 - 628) / 2 = 286
# Bottom: 286 + 628 = 914
cropped_img = img.crop((0, 286, 1200, 914))
cropped_img.save('public/11-landscape.png')
print("Cropped successfully")
