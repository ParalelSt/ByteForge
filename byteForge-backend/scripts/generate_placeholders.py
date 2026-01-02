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

# Games
games_products = [
    # PC Games
    ('elden_ring.png', 'Elden Ring'),
    ('baldurs_gate_3.png', "Baldur's Gate 3"),
    ('cyberpunk_2077.png', 'Cyberpunk 2077'),
    ('witcher_3.png', 'The Witcher 3'),
    ('hogwarts_legacy.png', 'Hogwarts Legacy'),
    ('half_life_alyx.png', 'Half-Life Alyx'),
    ('stardew_valley.png', 'Stardew Valley'),
    ('valorant.png', 'Valorant'),
    ('league_of_legends.png', 'League of Legends'),
    ('minecraft.png', 'Minecraft'),
    # Console Games
    ('rdr2.png', 'Red Dead Redemption 2'),
    ('god_of_war_ragnarok.png', 'God of War Ragnarök'),
    ('spiderman_2.png', 'Spider-Man 2'),
    ('last_of_us_2.png', 'Last of Us II'),
    ('horizon_forbidden_west.png', 'Horizon Forbidden West'),
    ('gran_turismo_7.png', 'Gran Turismo 7'),
    ('fifa_25.png', 'FIFA 25'),
    ('nba_2k26.png', 'NBA 2K26'),
    ('cod_mw4.png', 'CoD MW4'),
    ('mario_kart_9.png', 'Mario Kart 9'),
]

# Components
components_products = [
    # GPUs
    ('nvidia_rtx_4080.png', 'NVIDIA RTX 4080'),
    ('asus_rog_strix_b650.png', 'ROG Strix B650'),
    ('amd_ryzen_9_7950x.png', 'Ryzen 9 7950X'),
    ('samsung_980_pro.png', 'Samsung 980 PRO'),
    ('corsair_vengeance_rgb.png', 'Vengeance RGB'),
    ('crucial_p5_plus.png', 'Crucial P5 Plus'),
    ('seasonic_focus_gx750.png', 'Focus GX-750'),
    ('evga_supernova_650g5.png', 'SuperNOVA 650 G5'),
    ('phanteks_p400a.png', 'P400A'),
    ('bequiet_500dx.png', 'Pure Base 500DX'),
    # Add more as needed
]

# Phones
phones_products = [
    ('iphone_15.png', 'iPhone 15'),
    ('iphone_15_pro.png', 'iPhone 15 Pro'),
    ('samsung_s24_ultra.png', 'Galaxy S24 Ultra'),
    ('google_pixel_8_pro.png', 'Pixel 8 Pro'),
    ('oneplus_12.png', 'OnePlus 12'),
    ('asus_rog_phone_7.png', 'ROG Phone 7'),
    ('samsung_z_flip_5.png', 'Galaxy Z Flip 5'),
    ('lian_li_o11.png', 'Lian Li O11'),
    ('nzxt_h510_elite.png', 'NZXT H510 Elite'),
    ('cooler_master_h500.png', 'Cooler Master H500'),
]

# Accessories
accessories_products = [
    ('mousepad_xxl.png', 'Mouse Pad XXL'),
    ('controller_charger.png', 'Controller Charger'),
    ('cable_management.png', 'Cable Management'),
    ('webcam_1080p.png', 'Webcam 1080p'),
    ('blue_yeti.png', 'Blue Yeti'),
    ('ring_light.png', 'Ring Light'),
    ('laptop_stand.png', 'Laptop Stand'),
    ('elgato_stream_deck.png', 'Stream Deck'),
    ('smart_led_bulb.png', 'Smart LED Bulb'),
    ('usb_c_fast_charger.png', 'USB-C Charger'),
]

# Bundles
bundles_products = [
    ('bundle_gaming_starter.png', 'Gaming Starter Bundle'),
    ('bundle_streaming.png', 'Streaming Setup Bundle'),
    ('bundle_rgb_gaming.png', 'RGB Gaming Bundle'),
    ('bundle_content_creator.png', 'Content Creator Bundle'),
    ('bundle_pc_build.png', 'PC Build Bundle'),
]


# New products for each category/subcategory (at least 10 each)
new_products = [
    # Games
    ('starfield.png', 'Starfield'),
    ('alan_wake_2.png', 'Alan Wake II'),
    ('diablo_iv.png', 'Diablo IV'),
    ('forza_horizon_5.png', 'Forza Horizon 5'),
    ('cities_skylines_2.png', 'Cities: Skylines II'),
    ('palworld.png', 'Palworld'),
    ('hades_2.png', 'Hades II'),
    ('stalker_2.png', 'S.T.A.L.K.E.R. 2'),
    ('frostpunk_2.png', 'Frostpunk 2'),
    ('dragons_dogma_2.png', "Dragon's Dogma II"),
    # PC Components
    ('intel_core_i9_14900k.png', 'Intel Core i9-14900K'),
    ('amd_radeon_rx_7900_xtx.png', 'AMD Radeon RX 7900 XTX'),
    ('corsair_dominator_platinum.png', 'Corsair Dominator Platinum 64GB'),
    ('samsung_990_pro_4tb.png', 'Samsung 990 PRO 4TB'),
    ('asus_rog_maximus_z790.png', 'ASUS ROG Maximus Z790'),
    ('evga_supernova_1000_g6.png', 'EVGA SuperNOVA 1000 G6'),
    ('noctua_nh_d15_chromax.png', 'Noctua NH-D15 Chromax'),
    ('phanteks_eclipse_g500a.png', 'Phanteks Eclipse G500A'),
    ('crucial_t700_2tb.png', 'Crucial T700 2TB Gen5 SSD'),
    ('gskill_trident_z5_rgb.png', 'G.SKILL Trident Z5 RGB 32GB'),
    # Peripherals
    ('razer_viper_v3_pro.png', 'Razer Viper V3 Pro'),
    ('steelseries_apex_9_tkl.png', 'SteelSeries Apex 9 TKL'),
    ('hyperx_cloud_alpha_wireless.png', 'HyperX Cloud Alpha Wireless'),
    ('logitech_streamcam.png', 'Logitech StreamCam'),
    ('elgato_wave_3.png', 'Elgato Wave:3'),
    ('corsair_mm700_rgb.png', 'Corsair MM700 RGB'),
    ('razer_blackshark_v2_pro.png', 'Razer BlackShark V2 Pro'),
    ('asus_rog_strix_scope_rx.png', 'ASUS ROG Strix Scope RX'),
    ('steelseries_qck_prism_xl.png', 'SteelSeries QcK Prism XL'),
    ('logitech_g733_lightspeed.png', 'Logitech G733 Lightspeed'),
    # PC Cases
    ('lian_li_pc_o11d_evo.png', 'Lian Li PC-O11D EVO'),
    ('fractal_design_torrent.png', 'Fractal Design Torrent'),
    ('nzxt_h7_flow.png', 'NZXT H7 Flow'),
    ('phanteks_enthoo_pro_2.png', 'Phanteks Enthoo Pro 2'),
    ('cooler_master_td500_mesh.png', 'Cooler Master TD500 Mesh'),
    ('corsair_5000d_airflow.png', 'Corsair 5000D Airflow'),
    ('thermaltake_core_p5.png', 'Thermaltake Core P5'),
    ('bequiet_silent_base_802.png', 'Be Quiet! Silent Base 802'),
    ('silverstone_fara_r1.png', 'SilverStone Fara R1'),
    ('inwin_305.png', 'InWin 305'),
    # Phones
    ('google_pixel_fold.png', 'Google Pixel Fold'),
    ('samsung_galaxy_s25_ultra.png', 'Samsung Galaxy S25 Ultra'),
    ('iphone_16_pro_max.png', 'iPhone 16 Pro Max'),
    ('oneplus_open.png', 'OnePlus Open'),
    ('asus_zenfone_11_ultra.png', 'ASUS Zenfone 11 Ultra'),
    ('motorola_razr_50.png', 'Motorola Razr 50'),
    ('sony_xperia_1_vi.png', 'Sony Xperia 1 VI'),
    ('xiaomi_mi_14_ultra.png', 'Xiaomi Mi 14 Ultra'),
    ('oppo_find_n3.png', 'Oppo Find N3'),
    ('iphone_se_2026.png', 'iPhone SE 2026'),
    # Accessories
    ('razer_firefly_v2.png', 'Razer Firefly V2'),
    ('anker_powerwave_pad.png', 'Anker PowerWave Pad'),
    ('cablemod_pro_kit.png', 'CableMod Pro Kit'),
    ('logitech_c922_pro_stream.png', 'Logitech C922 Pro Stream'),
    ('shure_mv7_podcast_mic.png', 'Shure MV7 Podcast Mic'),
    ('elgato_key_light_air.png', 'Elgato Key Light Air'),
    ('twelve_south_curve_stand.png', 'Twelve South Curve Stand'),
    ('elgato_stream_deck_xl.png', 'Elgato Stream Deck XL'),
    ('philips_hue_smart_bulb.png', 'Philips Hue Smart Bulb'),
    ('samsung_wireless_charger_duo.png', 'Samsung Wireless Charger Duo'),
    # Bundles
    ('ultimate_gaming_bundle.png', 'Ultimate Gaming Bundle'),
    ('pro_streamer_bundle.png', 'Pro Streamer Bundle'),
    ('pc_builders_dream_bundle.png', "PC Builder's Dream Bundle"),
    ('mobile_creator_bundle.png', 'Mobile Creator Bundle'),
    ('rgb_enthusiast_bundle.png', 'RGB Enthusiast Bundle'),
    ('work_from_home_bundle.png', 'Work From Home Bundle'),
    ('console_gamer_bundle.png', 'Console Gamer Bundle'),
    ('streaming_starter_bundle.png', 'Streaming Starter Bundle'),
    ('pc_upgrade_bundle.png', 'PC Upgrade Bundle'),
    ('travel_tech_bundle.png', 'Travel Tech Bundle'),
]


products = products + [
    # Games
    ('remnant_2.png', 'Remnant II'),
    ('lies_of_p.png', 'Lies of P'),
    ('alan_wake_remastered.png', 'Alan Wake Remastered'),
    ('payday_3.png', 'Payday 3'),
    ('warhammer_darktide.png', 'Warhammer 40K: Darktide'),
    ('dave_the_diver.png', 'Dave the Diver'),
    ('persona_5_tactica.png', 'Persona 5 Tactica'),
    ('system_shock_remake.png', 'System Shock Remake'),
    ('party_animals.png', 'Party Animals'),
    ('street_fighter_6.png', 'Street Fighter 6'),
    # PC Components
    ('intel_core_i7_14700k.png', 'Intel Core i7-14700K'),
    ('amd_ryzen_7_7800x3d.png', 'AMD Ryzen 7 7800X3D'),
    ('msi_geforce_rtx_4070.png', 'MSI GeForce RTX 4070'),
    ('kingston_fury_32gb.png', 'Kingston Fury 32GB DDR5'),
    ('samsung_870_evo_2tb.png', 'Samsung 870 EVO 2TB'),
    ('gigabyte_z790_aorus.png', 'Gigabyte Z790 AORUS'),
    ('corsair_rm1000x.png', 'Corsair RM1000x'),
    ('arctic_freezer_50.png', 'Arctic Freezer 50'),
    ('fractal_design_meshify_2.png', 'Fractal Design Meshify 2'),
    ('adata_legend_960_1tb.png', 'ADATA Legend 960 1TB'),
    # Peripherals
    ('logitech_g502_x_plus.png', 'Logitech G502 X Plus'),
    ('razer_huntsman_v2.png', 'Razer Huntsman V2'),
    ('steelseries_arctis_7p.png', 'SteelSeries Arctis 7P'),
    ('elgato_facecam.png', 'Elgato Facecam'),
    ('hyperx_quadcast_s.png', 'HyperX QuadCast S'),
    ('glorious_ice_mousepad.png', 'Glorious Ice Mousepad'),
    ('asus_rog_cetraplus.png', 'ASUS ROG Cetra Plus'),
    ('corsair_k100_air.png', 'Corsair K100 Air'),
    ('logitech_g560_lightsync.png', 'Logitech G560 Lightsync'),
    ('razer_basilisk_v3_pro.png', 'Razer Basilisk V3 Pro'),
    # PC Cases
    ('cooler_master_haf_700.png', 'Cooler Master HAF 700'),
    ('nzxt_h510_flow.png', 'NZXT H510 Flow'),
    ('bequiet_pure_base_500.png', 'Be Quiet! Pure Base 500'),
    ('phanteks_p500a.png', 'Phanteks P500A'),
    ('lian_li_lancool_216.png', 'Lian Li Lancool 216'),
    ('silverstone_sugo_14.png', 'SilverStone SUGO 14'),
    ('inwin_a1_plus.png', 'InWin A1 Plus'),
    ('thermaltake_tower_500.png', 'Thermaltake Tower 500'),
    ('corsair_4000x_rgb.png', 'Corsair 4000X RGB'),
    ('fractal_design_define_7.png', 'Fractal Design Define 7'),
    # Phones
    ('samsung_galaxy_a54.png', 'Samsung Galaxy A54'),
    ('iphone_15_mini.png', 'iPhone 15 Mini'),
    ('oneplus_nord_3.png', 'OnePlus Nord 3'),
    ('google_pixel_7a.png', 'Google Pixel 7a'),
    ('sony_xperia_5_v.png', 'Sony Xperia 5 V'),
    ('motorola_edge_40.png', 'Motorola Edge 40'),
    ('xiaomi_redmi_note_12.png', 'Xiaomi Redmi Note 12'),
    ('asus_zenfone_10.png', 'ASUS Zenfone 10'),
    ('oppo_reno_10_pro.png', 'Oppo Reno 10 Pro'),
    ('realme_gt_neo_5.png', 'Realme GT Neo 5'),
    # Accessories
    ('anker_usb_c_hub.png', 'Anker USB-C Hub'),
    ('razer_goliathus_chroma.png', 'Razer Goliathus Chroma'),
    ('logitech_brio_4k.png', 'Logitech Brio 4K'),
    ('elgato_stream_deck_mini.png', 'Elgato Stream Deck Mini'),
    ('corsair_virtuso_xt.png', 'Corsair Virtuso XT'),
    ('philips_hue_play_bar.png', 'Philips Hue Play Bar'),
    ('shure_sm7b.png', 'Shure SM7B'),
    ('twelve_south_bookarc.png', 'Twelve South BookArc'),
    ('satechi_dock5.png', 'Satechi Dock5'),
    ('steelseries_rival_600.png', 'SteelSeries Rival 600'),
    # Bundles
    ('streamer_pro_kit.png', 'Streamer Pro Kit'),
    ('gaming_essentials_pack.png', 'Gaming Essentials Pack'),
    ('mobile_power_bundle.png', 'Mobile Power Bundle'),
    ('rgb_setup_bundle.png', 'RGB Setup Bundle'),
    ('workstation_upgrade_bundle.png', 'Workstation Upgrade Bundle'),
    ('travel_gamer_bundle.png', 'Travel Gamer Bundle'),
    ('creator_studio_bundle.png', 'Creator Studio Bundle'),
    ('console_accessory_bundle.png', 'Console Accessory Bundle'),
    ('office_starter_bundle.png', 'Office Starter Bundle'),
    ('ultimate_upgrade_bundle.png', 'Ultimate Upgrade Bundle'),
]

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
