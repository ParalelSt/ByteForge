import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, "..", "images", "product_images");

// Create directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Better product images with transparent backgrounds where possible
const productImages = {
  // G Fuel - Energy drinks
  "gfuel_blue_ice.png":
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
  "gfuel_hype_sauce.png":
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
  "gfuel_pewdiepie_shaker.png":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
  "gfuel_starter_kit.png":
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
  "gfuel_hydration.png":
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",

  // Peripherals - Gaming mice, keyboards, headsets
  "logitech_g_pro_superlight.png":
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
  "razer_blackwidow_v4.png":
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
  "steelseries_arctis_nova.png":
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
  "hyperx_cloud_ii.png":
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
  "corsair_k70_rgb.png":
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
  "razer_deathadder_v3.png":
    "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",

  // Components - PC parts
  "nvidia_rtx_4080.png":
    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
  "amd_ryzen_9_7950x.png":
    "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80",
  "corsair_vengeance_rgb.png":
    "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
  "samsung_980_pro.png":
    "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
  "asus_rog_strix_b650.png":
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
  "corsair_rm850x.png":
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
  "nzxt_kraken_x63.png":
    "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800&q=80",

  // Cases - PC cases
  "nzxt_h510_elite.png":
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
  "corsair_4000d.png":
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
  "lian_li_o11.png":
    "https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80",
  "fractal_meshify_c.png":
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
  "cooler_master_h500.png":
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",

  // Phones - Smartphones
  "iphone_15_pro.png":
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
  "samsung_s24_ultra.png":
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
  "google_pixel_8_pro.png":
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
  "oneplus_12.png":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  "iphone_15.png":
    "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&q=80",
  "samsung_z_flip_5.png":
    "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&q=80",

  // Games - Video game covers
  "elden_ring.png":
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
  "baldurs_gate_3.png":
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
  "cyberpunk_2077.png":
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
  "rdr2.png":
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
  "witcher_3.png":
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  "god_of_war_ragnarok.png":
    "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
  "hogwarts_legacy.png":
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",

  // Accessories - Gaming accessories
  "mousepad_xxl.png":
    "https://images.unsplash.com/photo-1625281730579-421a2ab3fe65?w=800&q=80",
  "controller_charger.png":
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
  "cable_management.png":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "webcam_1080p.png":
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
  "blue_yeti.png":
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
  "elgato_stream_deck.png":
    "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80",
  "ring_light.png":
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
  "laptop_stand.png":
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",

  // Bundles - Gaming setups
  "bundle_gaming_starter.png":
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
  "bundle_streaming.png":
    "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80",
  "bundle_rgb_gaming.png":
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
  "bundle_content_creator.png":
    "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80",
  "bundle_pc_build.png":
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imageDir, filename);
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${filename}: ${response.statusCode}`)
          );
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });

    file.on("error", (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log("Starting to download product images...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const [filename, url] of Object.entries(productImages)) {
    try {
      await downloadImage(url, filename);
      successCount++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`✗ Error downloading ${filename}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Download complete!`);
  console.log(`Success: ${successCount} images`);
  console.log(`Failed: ${errorCount} images`);
  console.log(`\nNext steps:`);
  console.log(`1. Run: node scripts/removeBackgroundFromExisting.js`);
  console.log(`   (This will remove backgrounds from all images)`);
}

downloadAllImages();
