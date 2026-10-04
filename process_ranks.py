import os
from PIL import Image

def process_ranks():
    input_path = r'C:\Users\pc\.gemini\antigravity-ide\brain\54e23a30-ad5f-4a4d-bc47-6538561fbce9\.user_uploaded\media_1791100858731.png'
    output_dir = r'C:\witty_todolist\frontend\public\ranks'
    
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(input_path).convert("RGBA")
    
    ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Supreme', 'Extra Supreme']
    
    cell_w = 1024 // 4
    cell_h = 520 // 2
    icon_h = 190 
    
    # Background color approximate
    bg_r, bg_g, bg_b = 31, 28, 44 # Dark background
    
    for idx, rank in enumerate(ranks):
        row = idx // 4
        col = idx % 4
        
        left = col * cell_w
        top = row * cell_h
        right = left + cell_w
        bottom = top + icon_h
        
        cropped = img.crop((left, top, right, bottom))
        
        # Make transparent
        datas = cropped.getdata()
        new_data = []
        for item in datas:
            # item is (R, G, B, A)
            r, g, b, a = item
            # Calculate distance from background
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            if dist < 60:
                # Almost background -> transparent
                new_data.append((r, g, b, 0))
            elif dist < 100:
                # Edge -> semi transparent
                alpha = int(((dist - 60) / 40) * 255)
                new_data.append((r, g, b, alpha))
            else:
                new_data.append(item)
                
        cropped.putdata(new_data)
        
        # Crop tightly to the bounding box of non-transparent pixels
        bbox = cropped.getbbox()
        if bbox:
            cropped = cropped.crop(bbox)
        
        out_path = os.path.join(output_dir, f"{idx}.png")
        cropped.save(out_path, "PNG")
        print(f"Saved {rank} to {out_path}")

if __name__ == '__main__':
    process_ranks()
