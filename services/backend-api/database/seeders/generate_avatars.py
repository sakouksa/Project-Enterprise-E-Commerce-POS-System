#!/usr/bin/env python3
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

output_dir = "/Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/services/backend-api/storage/app/public/customers"
os.makedirs(output_dir, exist_ok=True)

# 50 Distinct harmonious color themes [bg_top, bg_bottom, skin, hair, clothes, accent]
PALETTES = [
    # 1-10: Executive & Business
    ((41, 72, 152), (18, 38, 92), (255, 219, 172), (44, 30, 20), (30, 41, 59), (59, 130, 246)),
    ((15, 118, 110), (19, 78, 74), (241, 194, 125), (74, 4, 4), (17, 94, 89), (45, 212, 191)),
    ((67, 56, 202), (49, 46, 129), (255, 205, 148), (28, 25, 23), (30, 27, 75), (129, 140, 248)),
    ((180, 83, 9), (120, 53, 15), (224, 172, 105), (31, 41, 55), (146, 64, 14), (251, 191, 36)),
    ((190, 24, 93), (131, 24, 67), (255, 224, 189), (67, 20, 7), (157, 23, 77), (244, 114, 182)),
    ((13, 148, 136), (17, 94, 89), (198, 134, 66), (17, 24, 39), (15, 118, 110), (94, 234, 212)),
    ((99, 102, 241), (67, 56, 202), (255, 219, 172), (217, 119, 6), (79, 70, 229), (165, 180, 252)),
    ((16, 185, 129), (5, 150, 105), (241, 194, 125), (41, 37, 36), (4, 120, 87), (110, 231, 183)),
    ((225, 29, 72), (159, 18, 57), (255, 205, 148), (17, 24, 39), (190, 18, 60), (251, 113, 133)),
    ((124, 58, 237), (91, 33, 182), (224, 172, 105), (78, 29, 14), (109, 40, 217), (196, 181, 253)),
    
    # 11-20: Modern Tech & Creative
    ((2, 132, 199), (3, 105, 161), (255, 224, 189), (30, 41, 59), (7, 89, 133), (56, 189, 248)),
    ((5, 150, 105), (4, 120, 87), (198, 134, 66), (31, 41, 55), (6, 95, 70), (52, 211, 153)),
    ((217, 70, 239), (162, 28, 175), (255, 219, 172), (88, 28, 135), (134, 25, 143), (240, 171, 252)),
    ((234, 88, 12), (194, 65, 12), (241, 194, 125), (24, 24, 27), (154, 52, 18), (251, 146, 60)),
    ((79, 70, 229), (55, 48, 163), (255, 205, 148), (69, 26, 3), (67, 56, 202), (165, 180, 252)),
    ((14, 165, 233), (2, 132, 199), (224, 172, 105), (15, 23, 42), (3, 105, 161), (125, 211, 252)),
    ((168, 85, 247), (126, 34, 206), (255, 224, 189), (38, 38, 38), (107, 33, 168), (216, 180, 254)),
    ((20, 184, 166), (13, 148, 136), (198, 134, 66), (67, 20, 7), (15, 118, 110), (94, 234, 212)),
    ((244, 63, 94), (225, 29, 72), (255, 219, 172), (23, 23, 23), (190, 18, 60), (253, 164, 175)),
    ((139, 92, 246), (109, 40, 217), (241, 194, 125), (120, 53, 15), (91, 33, 182), (196, 181, 253)),

    # 21-30: Enterprise Sleek & Minimalist
    ((51, 65, 85), (30, 41, 59), (255, 205, 148), (2, 6, 23), (15, 23, 42), (148, 163, 184)),
    ((71, 85, 105), (51, 65, 85), (224, 172, 105), (68, 64, 60), (30, 41, 59), (203, 213, 225)),
    ((120, 113, 108), (87, 83, 78), (255, 224, 189), (28, 25, 23), (68, 64, 60), (214, 211, 209)),
    ((30, 58, 138), (23, 37, 84), (198, 134, 66), (15, 23, 42), (30, 41, 59), (96, 165, 250)),
    ((6, 78, 59), (4, 47, 46), (255, 219, 172), (41, 37, 36), (6, 95, 70), (52, 211, 153)),
    ((88, 28, 135), (59, 7, 100), (241, 194, 125), (24, 24, 27), (107, 33, 168), (216, 180, 254)),
    ((136, 19, 55), (76, 5, 25), (255, 205, 148), (67, 20, 7), (159, 18, 57), (251, 113, 133)),
    ((124, 45, 18), (67, 20, 7), (224, 172, 105), (28, 25, 23), (154, 52, 18), (251, 146, 60)),
    ((19, 78, 74), (4, 47, 46), (255, 224, 189), (31, 41, 55), (15, 118, 110), (94, 234, 212)),
    ((30, 27, 75), (15, 23, 42), (198, 134, 66), (2, 6, 23), (49, 46, 129), (129, 140, 248)),

    # 31-40: Vibrant Retail & POS VIP
    ((236, 72, 153), (190, 24, 93), (255, 219, 172), (76, 29, 149), (157, 23, 77), (244, 114, 182)),
    ((245, 158, 11), (217, 119, 6), (241, 194, 125), (30, 41, 59), (180, 83, 9), (252, 211, 77)),
    ((16, 185, 129), (4, 120, 87), (255, 205, 148), (23, 23, 23), (5, 150, 105), (110, 231, 183)),
    ((59, 130, 246), (29, 78, 216), (224, 172, 105), (69, 26, 3), (37, 99, 235), (147, 197, 253)),
    ((168, 85, 247), (147, 51, 234), (255, 224, 189), (15, 23, 42), (126, 34, 206), (216, 180, 254)),
    ((249, 115, 22), (234, 88, 12), (198, 134, 66), (41, 37, 36), (194, 65, 12), (253, 186, 116)),
    ((6, 182, 212), (8, 145, 178), (255, 219, 172), (28, 25, 23), (14, 116, 144), (103, 232, 249)),
    ((132, 204, 22), (101, 163, 13), (241, 194, 125), (24, 24, 27), (77, 124, 15), (190, 242, 100)),
    ((239, 68, 68), (220, 38, 38), (255, 205, 148), (67, 20, 7), (185, 28, 28), (252, 165, 165)),
    ((99, 102, 241), (79, 70, 229), (224, 172, 105), (15, 23, 42), (67, 56, 202), (165, 180, 252)),

    # 41-50: Premium Platinum & Gold
    ((202, 138, 4), (161, 98, 7), (255, 224, 189), (38, 38, 38), (133, 77, 14), (253, 224, 71)),
    ((14, 116, 144), (21, 94, 117), (198, 134, 66), (23, 23, 23), (15, 76, 92), (103, 232, 249)),
    ((147, 51, 234), (107, 33, 168), (255, 219, 172), (69, 26, 3), (88, 28, 135), (216, 180, 254)),
    ((3, 105, 161), (7, 89, 133), (241, 194, 125), (15, 23, 42), (12, 74, 110), (125, 211, 252)),
    ((76, 29, 149), (46, 16, 101), (255, 205, 148), (41, 37, 36), (59, 7, 100), (196, 181, 253)),
    ((159, 18, 57), (136, 19, 55), (224, 172, 105), (24, 24, 27), (114, 15, 41), (251, 113, 133)),
    ((4, 120, 87), (6, 95, 70), (255, 224, 189), (67, 20, 7), (6, 78, 59), (110, 231, 183)),
    ((180, 83, 9), (146, 64, 14), (198, 134, 66), (15, 23, 42), (120, 53, 15), (251, 191, 36)),
    ((67, 56, 202), (55, 48, 163), (255, 219, 172), (38, 38, 38), (49, 46, 129), (165, 180, 252)),
    ((30, 41, 59), (15, 23, 42), (241, 194, 125), (2, 6, 23), (2, 6, 23), (203, 213, 225)),
]

def draw_gradient(draw, width, height, c1, c2):
    for y in range(height):
        r = int(c1[0] + (c2[0] - c1[0]) * (y / height))
        g = int(c1[1] + (c2[1] - c1[1]) * (y / height))
        b = int(c1[2] + (c2[2] - c1[2]) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def generate_avatar(idx, palette):
    bg_top, bg_bottom, skin, hair, clothes, accent = palette
    size = 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background Circle with Gradient
    bg_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_img)
    draw_gradient(bg_draw, size, size, bg_top, bg_bottom)
    
    # Mask to perfect circle
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([8, 8, size - 8, size - 8], fill=255)
    img.paste(bg_img, (0, 0), mask)

    # Re-obtain draw handle
    draw = ImageDraw.Draw(img)

    # Subtle inner decorative glow ring
    draw.ellipse([10, 10, size - 10, size - 10], outline=(255, 255, 255, 60), width=3)

    # Character Attributes Variation based on idx
    has_glasses = (idx % 3 == 0)
    has_tie = (idx % 2 == 0)
    gender_female = (idx % 2 == 1)
    hair_style = idx % 5  # 0: short fade, 1: curly/bob, 2: side part, 3: long hair, 4: modern slick

    # 2. Body / Clothes (Shoulders)
    body_top = 165
    draw.ellipse([30, body_top, size - 30, size + 110], fill=clothes)

    # Collar / Neck
    neck_color = (max(0, skin[0]-25), max(0, skin[1]-25), max(0, skin[2]-25))
    draw.rectangle([112, 135, 144, 175], fill=neck_color)

    # Shirt V-neck / Collar
    shirt_color = (255, 255, 255) if has_tie else accent
    draw.polygon([(110, 165), (146, 165), (128, 205)], fill=shirt_color)

    if has_tie:
        # Necktie
        draw.polygon([(124, 175), (132, 175), (134, 235), (128, 245), (122, 235)], fill=accent)
        # Tie knot
        draw.polygon([(122, 172), (134, 172), (131, 182), (125, 182)], fill=(max(0, accent[0]-30), max(0, accent[1]-30), max(0, accent[2]-30)))
    else:
        # Suit Lapels
        draw.line([(100, 165), (120, 220)], fill=(255, 255, 255, 70), width=3)
        draw.line([(156, 165), (136, 220)], fill=(255, 255, 255, 70), width=3)

    # 3. Head & Face
    head_box = [86, 68, 170, 164]
    draw.ellipse(head_box, fill=skin)

    # Ears
    draw.ellipse([78, 102, 92, 126], fill=skin)
    draw.ellipse([164, 102, 178, 126], fill=skin)

    # 4. Eyes & Eyebrows
    eye_color = (28, 25, 23)
    # Left eye
    draw.ellipse([104, 106, 114, 116], fill=eye_color)
    draw.ellipse([106, 107, 109, 110], fill=(255, 255, 255)) # Sparkle
    # Right eye
    draw.ellipse([142, 106, 152, 116], fill=eye_color)
    draw.ellipse([144, 107, 147, 110], fill=(255, 255, 255)) # Sparkle

    # Eyebrows
    draw.arc([101, 95, 117, 105], 190, 350, fill=hair, width=3)
    draw.arc([139, 95, 155, 105], 190, 350, fill=hair, width=3)

    # Nose
    nose_color = (max(0, skin[0]-30), max(0, skin[1]-30), max(0, skin[2]-30))
    draw.line([(128, 112), (126, 126)], fill=nose_color, width=2)
    draw.line([(126, 126), (131, 127)], fill=nose_color, width=2)

    # Cheeks / Blush
    blush_color = (244, 114, 182, 80) if gender_female else (251, 146, 60, 45)
    # Create temporary layer for transparent blush
    blush_img = Image.new("RGBA", (size, size), (0,0,0,0))
    blush_draw = ImageDraw.Draw(blush_img)
    blush_draw.ellipse([95, 118, 111, 128], fill=blush_color)
    blush_draw.ellipse([145, 118, 161, 128], fill=blush_color)
    img.alpha_composite(blush_img)
    draw = ImageDraw.Draw(img)

    # Smile / Mouth
    draw.arc([117, 128, 139, 142], 20, 160, fill=(185, 28, 28), width=3)

    # 5. Glasses
    if has_glasses:
        glasses_frame = (30, 41, 59) if (idx % 2 == 0) else (217, 119, 6)
        # Left lens
        draw.rounded_rectangle([98, 100, 119, 120], radius=5, outline=glasses_frame, width=3)
        # Right lens
        draw.rounded_rectangle([137, 100, 158, 120], radius=5, outline=glasses_frame, width=3)
        # Bridge
        draw.line([(119, 108), (137, 108)], fill=glasses_frame, width=3)
        # Temple arms
        draw.line([(98, 108), (82, 105)], fill=glasses_frame, width=2)
        draw.line([(158, 108), (174, 105)], fill=glasses_frame, width=2)

    # 6. Hair
    if hair_style == 0:  # Short fade / Crew cut
        draw.ellipse([84, 56, 172, 98], fill=hair)
        draw.rectangle([84, 76, 172, 90], fill=hair)
    elif hair_style == 1:  # Curly / Voluminous
        for hx, hy, hr in [(88, 62, 22), (110, 54, 25), (136, 52, 26), (160, 58, 24), (168, 76, 20), (84, 76, 20)]:
            draw.ellipse([hx-hr, hy-hr, hx+hr, hy+hr], fill=hair)
    elif hair_style == 2:  # Stylish Side Part
        draw.polygon([(82, 90), (84, 60), (120, 48), (168, 54), (174, 88), (162, 70), (128, 64), (92, 78)], fill=hair)
        draw.ellipse([86, 54, 170, 94], fill=hair)
    elif hair_style == 3:  # Long flowing / Bob
        draw.ellipse([80, 54, 176, 105], fill=hair)
        draw.polygon([(76, 90), (90, 80), (86, 180), (68, 180)], fill=hair) # Left strand
        draw.polygon([(180, 90), (166, 80), (170, 180), (188, 180)], fill=hair) # Right strand
    else:  # Modern Top Bun / Chic
        draw.ellipse([110, 36, 146, 72], fill=hair) # Top bun
        draw.ellipse([84, 58, 172, 96], fill=hair)

    # 7. Final outer clipping to circular badge
    final_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    final_img.paste(img, (0, 0), mask)
    
    # Save
    filename = f"avatar_{idx:02d}.png"
    filepath = os.path.join(output_dir, filename)
    final_img.save(filepath, "PNG", optimize=True)
    print(f"Generated {filename}")

def main():
    print(f"Generating 50 distinctive customer avatar images in {output_dir}...")
    for i in range(1, 51):
        palette = PALETTES[(i - 1) % len(PALETTES)]
        generate_avatar(i, palette)
    print("ALL 50 AVATARS GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
