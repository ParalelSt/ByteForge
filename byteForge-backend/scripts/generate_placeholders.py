import os
from PIL import Image, ImageDraw, ImageFont

# Directory to save generated images
IMAGE_DIR = os.path.join(os.path.dirname(__file__), '../images/product_images')
os.makedirs(IMAGE_DIR, exist_ok=True)


# Import GFUEL products
try:
    from gfuel_products import products as gfuel_products
except ImportError:
    gfuel_products = []

# Add more product lists here for other categories as you generate them

# Peripherals and Monitors
peripherals_products = [
    # Mice
    ('logitech_g_pro_superlight.png', 'G Pro X Superlight'),
    ('razer_deathadder_v3.png', 'DeathAdder V3'),
    ('steelseries_rival_5.png', 'Rival 5'),
    ('glorious_model_o_wireless.png', 'Model O Wireless'),
    ('cooler_master_mm720.png', 'MM720'),
    ('magegee_portable.png', 'MageGee Portable'),
    ('noise_cancelling_mouse.png', 'Silent Mouse'),
    ('usb_c_fast_mouse.png', 'USB-C Mouse'),
    ('mousepad_xxl.png', 'Mouse Pad XXL'),
    ('phanteks_p400a_mouse.png', 'P400A Mouse'),

    # Keyboards
    ('razer_blackwidow_v4.png', 'BlackWidow V4 Pro'),
    ('corsair_k70_rgb.png', 'K70 RGB'),
    ('ducky_one_2_mini.png', 'One 2 Mini'),
    ('keychron_k6.png', 'Keychron K6'),
    ('logitech_g915_tkl.png', 'G915 TKL'),
    ('steelseries_apex_pro.png', 'Apex Pro'),
    ('hyperx_alloy_fps_pro.png', 'Alloy FPS Pro'),
    ('cooler_master_sk621.png', 'SK621'),
    ('asus_rog_strix_scope.png', 'ROG Strix Scope'),
    ('redragon_k552_kumara.png', 'K552 Kumara'),

    # Headsets
    ('steelseries_arctis_nova.png', 'Arctis Nova Pro'),
    ('hyperx_cloud_ii.png', 'Cloud II'),
    ('corsair_hs80.png', 'HS80 RGB'),
    ('epos_h6pro_open.png', 'H6PRO Open'),
    ('blue_yeti.png', 'Blue Yeti'),
    ('logitech_g_pro_x_headset.png', 'G Pro X Headset'),
    ('razer_kraken_x.png', 'Kraken X'),
    ('sennheiser_gsp_300.png', 'GSP 300'),
    ('asus_rog_delta_s.png', 'ROG Delta S'),
    ('corsair_void_rgb_elite.png', 'Void RGB Elite'),

    # Monitors
    ('aoc_24g2.png', 'AOC 24G2'),
    ('lg_ultragear_27gn950.png', 'UltraGear 27GN950'),
    ('samsung_odyssey_g7.png', 'Odyssey G7'),
    ('asus_tuf_vg27aq.png', 'TUF VG27AQ'),
    ('alienware_aw2521h.png', 'AW2521H'),
    ('benq_zowie_xl2546k.png', 'ZOWIE XL2546K'),
    ('msi_optix_mag274qrf.png', 'Optix MAG274QRF'),
    ('gigabyte_m27q.png', 'M27Q'),
    ('viewsonic_xg2431.png', 'XG2431'),
    ('philips_momentum_279m1rv.png', 'Momentum 279M1RV'),
]

products = gfuel_products + peripherals_products

# If you want to auto-generate for all products in DB, you can later extend this script

# Image settings
WIDTH, HEIGHT = 400, 400
BG_COLOR = (20, 20, 20)
TEXT_COLOR = (255, 255, 255)
FONT_SIZE = 32

# Try to load a font, fallback to default
try:
    font = ImageFont.truetype("arial.ttf", FONT_SIZE)
except:
    font = ImageFont.load_default()

def generate_placeholder(filename, label):
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), label, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((WIDTH-w)/2, (HEIGHT-h)/2), label, fill=TEXT_COLOR, font=font)
    img.save(os.path.join(IMAGE_DIR, filename))

if __name__ == "__main__":
    for filename, label in products:
        generate_placeholder(filename, label)
    print(f"Generated {len(products)} placeholder images in {IMAGE_DIR}")
