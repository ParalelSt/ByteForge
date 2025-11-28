import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use placeholder service for product images
const productImages = {
  // G Fuel - use energy drink themed colors
  "gfuel_blue_ice.png":
    "https://placehold.co/400x400/1E90FF/ffffff?text=G+FUEL+Blue+Ice",
  "gfuel_hype_sauce.png":
    "https://placehold.co/400x400/FF1493/ffffff?text=G+FUEL+Hype",
  "gfuel_pewdiepie_shaker.png":
    "https://placehold.co/400x400/000000/FF0000?text=PewDiePie+Shaker",
  "gfuel_starter_kit.png":
    "https://placehold.co/400x400/32CD32/ffffff?text=G+FUEL+Starter",
  "gfuel_hydration.png":
    "https://placehold.co/400x400/00CED1/ffffff?text=Hydration",

  // Peripherals - tech themed
  "logitech_g_pro_superlight.png":
    "https://placehold.co/400x400/000000/9D4EDD?text=Logitech+Mouse",
  "razer_blackwidow_v4.png":
    "https://placehold.co/400x400/00FF00/000000?text=Razer+Keyboard",
  "steelseries_arctis_nova.png":
    "https://placehold.co/400x400/FF6500/000000?text=Arctis+Headset",
  "hyperx_cloud_ii.png":
    "https://placehold.co/400x400/FF0000/000000?text=HyperX+Cloud",
  "corsair_k70_rgb.png":
    "https://placehold.co/400x400/FFD700/000000?text=Corsair+K70",
  "razer_deathadder_v3.png":
    "https://placehold.co/400x400/00FF00/000000?text=DeathAdder",

  // Components
  "nvidia_rtx_4080.png":
    "https://placehold.co/400x400/76B900/000000?text=RTX+4080",
  "amd_ryzen_9_7950x.png":
    "https://placehold.co/400x400/ED1C24/ffffff?text=Ryzen+9",
  "corsair_vengeance_rgb.png":
    "https://placehold.co/400x400/FFD700/000000?text=Vengeance+RAM",
  "samsung_980_pro.png":
    "https://placehold.co/400x400/1428A0/ffffff?text=980+PRO+SSD",
  "asus_rog_strix_b650.png":
    "https://placehold.co/400x400/FF0000/000000?text=ROG+Strix",
  "corsair_rm850x.png":
    "https://placehold.co/400x400/FFD700/000000?text=PSU+850W",
  "nzxt_kraken_x63.png":
    "https://placehold.co/400x400/9D4EDD/ffffff?text=Kraken+AIO",

  // Cases
  "nzxt_h510_elite.png":
    "https://placehold.co/400x400/9D4EDD/ffffff?text=H510+Elite",
  "corsair_4000d.png":
    "https://placehold.co/400x400/FFD700/000000?text=4000D+Case",
  "lian_li_o11.png":
    "https://placehold.co/400x400/000000/ffffff?text=O11+Dynamic",
  "fractal_meshify_c.png":
    "https://placehold.co/400x400/1E90FF/ffffff?text=Meshify+C",
  "cooler_master_h500.png":
    "https://placehold.co/400x400/000000/FF0000?text=CM+H500",

  // Phones
  "iphone_15_pro.png":
    "https://placehold.co/400x400/000000/ffffff?text=iPhone+15+Pro",
  "samsung_s24_ultra.png":
    "https://placehold.co/400x400/1428A0/ffffff?text=S24+Ultra",
  "google_pixel_8_pro.png":
    "https://placehold.co/400x400/4285F4/ffffff?text=Pixel+8+Pro",
  "oneplus_12.png":
    "https://placehold.co/400x400/FF0000/ffffff?text=OnePlus+12",
  "iphone_15.png": "https://placehold.co/400x400/000000/ffffff?text=iPhone+15",
  "samsung_z_flip_5.png":
    "https://placehold.co/400x400/9D4EDD/ffffff?text=Z+Flip+5",

  // Games
  "elden_ring.png":
    "https://placehold.co/400x400/FFD700/000000?text=Elden+Ring",
  "baldurs_gate_3.png":
    "https://placehold.co/400x400/8B0000/ffffff?text=Baldur's+Gate",
  "cyberpunk_2077.png":
    "https://placehold.co/400x400/FFFF00/000000?text=Cyberpunk",
  "rdr2.png": "https://placehold.co/400x400/8B4513/ffffff?text=RDR2",
  "witcher_3.png": "https://placehold.co/400x400/4B0082/ffffff?text=Witcher+3",
  "god_of_war_ragnarok.png":
    "https://placehold.co/400x400/1E90FF/000000?text=God+of+War",
  "hogwarts_legacy.png":
    "https://placehold.co/400x400/740001/FFD700?text=Hogwarts",

  // Accessories
  "mousepad_xxl.png":
    "https://placehold.co/400x400/000000/00FF00?text=XXL+Mousepad",
  "controller_charger.png":
    "https://placehold.co/400x400/1E90FF/ffffff?text=Controller+Dock",
  "cable_management.png":
    "https://placehold.co/400x400/696969/ffffff?text=Cable+Kit",
  "webcam_1080p.png":
    "https://placehold.co/400x400/000000/ffffff?text=Webcam+1080p",
  "blue_yeti.png": "https://placehold.co/400x400/000000/00CED1?text=Blue+Yeti",
  "elgato_stream_deck.png":
    "https://placehold.co/400x400/000000/9D4EDD?text=Stream+Deck",
  "ring_light.png":
    "https://placehold.co/400x400/FFFFFF/000000?text=Ring+Light",
  "laptop_stand.png":
    "https://placehold.co/400x400/C0C0C0/000000?text=Laptop+Stand",

  // Bundles
  "bundle_gaming_starter.png":
    "https://placehold.co/400x400/FF6500/000000?text=Gaming+Bundle",
  "bundle_streaming.png":
    "https://placehold.co/400x400/9D4EDD/ffffff?text=Stream+Bundle",
  "bundle_rgb_gaming.png":
    "https://placehold.co/400x400/00FF00/000000?text=RGB+Bundle",
  "bundle_content_creator.png":
    "https://placehold.co/400x400/FF1493/ffffff?text=Creator+Bundle",
  "bundle_pc_build.png":
    "https://placehold.co/400x400/FFD700/000000?text=PC+Build",
};

const outputDir = path.join(__dirname, "../images/product_images");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});
        console.error(`✗ Failed: ${filename} - ${err.message}`);
        reject(err);
      });
  });
}

async function downloadAllImages() {
  console.log("Downloading placeholder product images...\n");

  let successCount = 0;
  let failCount = 0;

  for (const [filename, url] of Object.entries(productImages)) {
    try {
      await downloadImage(url, filename.replace(".png", ".jpg"));
      successCount++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      failCount++;
    }
  }

  console.log(`\n✅ Downloaded ${successCount} images`);
  if (failCount > 0) {
    console.log(`❌ Failed ${failCount} images`);
  }
}

downloadAllImages();
