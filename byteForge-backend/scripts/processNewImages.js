import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const IMAGES_DIR = path.join(process.cwd(), "images", "product_images");
const PROCESSED_LOG = path.join(
  process.cwd(),
  "scripts",
  "processed_images.json",
);

// Load or initialize processed images log
function loadProcessedLog() {
  try {
    if (fs.existsSync(PROCESSED_LOG)) {
      return JSON.parse(fs.readFileSync(PROCESSED_LOG, "utf8"));
    }
  } catch (e) {
    console.log("No previous log found, starting fresh");
  }
  return { processed: [], failed: [], skipped: [] };
}

function saveProcessedLog(log) {
  fs.writeFileSync(PROCESSED_LOG, JSON.stringify(log, null, 2));
}

// Sleep function
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Remove background using remove.bg API with retry logic
async function removeBackground(imageBuffer, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const form = new FormData();
      form.append("size", "auto");
      form.append("image_file", imageBuffer, { filename: "image.jpg" });

      const response = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        data: form,
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_KEY,
        },
        responseType: "arraybuffer",
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && attempt < retries) {
        // Rate limited - wait longer and retry
        const waitTime = attempt * 10000; // 10s, 20s, 30s
        console.log(
          `   ⏳ Rate limited. Waiting ${waitTime / 1000}s before retry ${attempt + 1}/${retries}...`,
        );
        await sleep(waitTime);
      } else {
        throw error;
      }
    }
  }
}

// Upload image to Supabase Storage
async function uploadToSupabase(imageBuffer, filename) {
  const { data, error } = await supabase.storage
    .from("product_images")
    .upload(`product_images/${filename}`, imageBuffer, {
      contentType: "image/png",
      upsert: true, // Overwrite if exists
    });

  if (error) throw error;
  return data;
}

// Get all new images (non-PNG files)
function getNewImages() {
  const files = fs.readdirSync(IMAGES_DIR);
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".webp", ".avif"].includes(ext);
  });
}

// Get content type from file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
  };
  return types[ext] || "image/jpeg";
}

// Upload image directly without background removal
async function uploadDirect(filename, log) {
  const baseName = path.basename(filename, path.extname(filename));
  const ext = path.extname(filename).toLowerCase();

  // Check if already uploaded
  if (log.uploaded && log.uploaded.includes(filename)) {
    console.log(`⏭️  Skipping ${filename} (already uploaded)`);
    return { status: "skipped", reason: "already uploaded" };
  }

  try {
    console.log(`🔄 Uploading: ${filename}`);

    // Read the image file
    const imagePath = path.join(IMAGES_DIR, filename);
    const imageBuffer = fs.readFileSync(imagePath);

    // Upload to Supabase with original format (directly to bucket root)
    const { data, error } = await supabase.storage
      .from("product_images")
      .upload(filename, imageBuffer, {
        contentType: getContentType(filename),
        upsert: true,
      });

    if (error) throw error;

    // Track uploaded
    if (!log.uploaded) log.uploaded = [];
    log.uploaded.push(filename);
    saveProcessedLog(log);

    console.log(`   ✅ Uploaded: ${filename}`);
    return { status: "success", output: filename };
  } catch (error) {
    console.error(`   ❌ Error uploading ${filename}:`, error.message);
    if (!log.uploadFailed) log.uploadFailed = [];
    log.uploadFailed.push({ file: filename, error: error.message });
    saveProcessedLog(log);
    return { status: "failed", error: error.message };
  }
}

// Process a single image
async function processImage(filename, log) {
  const baseName = path.basename(filename, path.extname(filename));
  const pngFilename = `${baseName}.png`;

  // Check if already processed
  if (log.processed.includes(filename)) {
    console.log(`⏭️  Skipping ${filename} (already processed)`);
    return { status: "skipped", reason: "already processed" };
  }

  try {
    console.log(`🔄 Processing: ${filename}`);

    // Read the image file
    const imagePath = path.join(IMAGES_DIR, filename);
    const imageBuffer = fs.readFileSync(imagePath);

    // Remove background
    console.log(`   📤 Removing background...`);
    const processedBuffer = await removeBackground(imageBuffer);

    // Upload to Supabase
    console.log(`   ☁️  Uploading to Supabase...`);
    await uploadToSupabase(processedBuffer, pngFilename);

    // Save processed PNG locally as well
    const localPngPath = path.join(IMAGES_DIR, pngFilename);
    fs.writeFileSync(localPngPath, processedBuffer);

    // Mark as processed
    log.processed.push(filename);
    saveProcessedLog(log);

    console.log(`   ✅ Done: ${pngFilename}`);
    return { status: "success", output: pngFilename };
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    log.failed.push({ file: filename, error: error.message });
    saveProcessedLog(log);
    return { status: "failed", error: error.message };
  }
}

// Match filename to product name in database
function filenameToProductName(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  // Convert underscores/hyphens to spaces and title case
  return baseName
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Normalize a string for comparison
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove all special chars
    .replace(/\s+/g, "");
}

// Manual mappings for tricky names
const MANUAL_MAPPINGS = {
  "GFUEL Hydration Formula": "g_fuel_hydration.png",
  "Red Dead Redemption 2": "rdr2.png",
  "Gaming Mouse Pad XXL": "mousepad_xxl.png",
  "Controller Charging Station": "controller_charger.png",
  "Spider-Man 2": "spiderman_2.png",
  "Call of Duty: Modern Warfare IV": "cod_mw4.png",
  "Cities: Skylines II": "cities_skylines_2.png",
  "Hades II": "hades_2.png",
  "S.T.A.L.K.E.R. 2": "stalker_2.png",
  "Dragon's Dogma II": "dragons_dogma_2.png",
  "Remnant II": "remnant_2.png",
  "be quiet! Dark Rock Pro 4": "cooler_bequiet_pro4.png",
  "Steam Gift Card $50": "giftcard_steam_50.png",
  "BenQ e-Reading Lamp": "light_benq_monitor.png",
};

// Update product images in database
async function updateProductImages() {
  console.log("\n📊 Fetching products from database...");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Found ${products.length} products`);

  // Get all image files in the folder (all formats)
  const imageFiles = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => /\.(png|jpg|jpeg|webp|avif)$/i.test(f));

  const updates = [];
  const matches = [];
  const noMatches = [];

  for (const product of products) {
    let matchedFile = null;

    // Check manual mappings first
    if (MANUAL_MAPPINGS[product.name]) {
      const manualFile = MANUAL_MAPPINGS[product.name];
      // Try with and without extension variations
      const baseName = manualFile.replace(/\.[^.]+$/, "");
      for (const file of imageFiles) {
        if (file === manualFile || file.startsWith(baseName + ".")) {
          matchedFile = file;
          break;
        }
      }
    }

    if (!matchedFile) {
      // Create expected filename from product name (try all extensions)
      const baseName = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

      // Try matching with any extension
      for (const file of imageFiles) {
        const fileBase = file.replace(/\.[^.]+$/, "");
        if (
          fileBase === baseName ||
          fileBase === product.name.toLowerCase().replace(/\s+/g, "_") ||
          fileBase === product.name.toLowerCase().replace(/\s+/g, "-")
        ) {
          matchedFile = file;
          break;
        }
      }
    }

    // If no exact match, try fuzzy matching
    if (!matchedFile) {
      const productWords = product.name.toLowerCase().split(/\s+/);
      for (const imgFile of imageFiles) {
        const fileBase = imgFile.replace(/\.[^.]+$/, "");
        const fileWords = fileBase.toLowerCase().split(/[_-]/);

        // Check if most words match
        const matchingWords = productWords.filter((w) => fileWords.includes(w));
        if (matchingWords.length >= Math.min(2, productWords.length)) {
          matchedFile = imgFile;
          break;
        }
      }
    }

    // Try normalized comparison
    if (!matchedFile) {
      const normalizedProduct = normalize(product.name);
      for (const imgFile of imageFiles) {
        const fileBase = imgFile.replace(/\.[^.]+$/, "");
        const normalizedFile = normalize(fileBase);
        if (
          normalizedProduct === normalizedFile ||
          normalizedProduct.includes(normalizedFile) ||
          normalizedFile.includes(normalizedProduct)
        ) {
          matchedFile = imgFile;
          break;
        }
      }
    }

    if (matchedFile) {
      matches.push({ product: product.name, file: matchedFile });
      if (product.image !== matchedFile) {
        updates.push({
          id: product.id,
          name: product.name,
          newImage: matchedFile,
        });
      }
    } else {
      noMatches.push(product.name);
    }
  }

  console.log(`\n✅ Matched: ${matches.length} products`);
  console.log(`❓ No match: ${noMatches.length} products`);
  console.log(`📝 Updates needed: ${updates.length} products\n`);

  if (noMatches.length > 0 && noMatches.length <= 50) {
    console.log("Products without matches:");
    noMatches.forEach((name) => console.log(`  - ${name}`));
  }

  return { matches, noMatches, updates };
}

// Apply database updates
async function applyUpdates(updates) {
  console.log(`\n🔄 Applying ${updates.length} database updates...`);

  let success = 0;
  let failed = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from("products")
      .update({ image: update.newImage })
      .eq("id", update.id);

    if (error) {
      console.error(`❌ Failed to update ${update.name}:`, error.message);
      failed++;
    } else {
      console.log(`✅ Updated: ${update.name} → ${update.newImage}`);
      success++;
    }
  }

  console.log(`\n📊 Results: ${success} success, ${failed} failed`);
}

// Delete old images from Supabase that are no longer needed
async function cleanupOldImages() {
  console.log("\n🧹 Cleaning up old images from Supabase...");

  // Get all files in Supabase
  const { data: files, error } = await supabase.storage
    .from("product_images")
    .list("product_images");

  if (error) {
    console.error("Error listing Supabase files:", error);
    return;
  }

  // Get current product images from DB
  const { data: products } = await supabase.from("products").select("image");

  const usedImages = new Set(products.map((p) => p.image).filter(Boolean));

  // Find unused images
  const unusedFiles = files.filter((f) => !usedImages.has(f.name));

  console.log(`Found ${unusedFiles.length} unused images in Supabase`);

  // Delete unused (optional - commented out for safety)
  // for (const file of unusedFiles) {
  //   await supabase.storage.from("product_images").remove([`product_images/${file.name}`]);
  //   console.log(`Deleted: ${file.name}`);
  // }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  switch (command) {
    case "process":
      // Process all new images
      const log = loadProcessedLog();
      const newImages = getNewImages();

      // Filter out already processed images
      const remaining = newImages.filter((img) => !log.processed.includes(img));
      console.log(`\n📷 Found ${newImages.length} total new images`);
      console.log(`   Already processed: ${log.processed.length}`);
      console.log(`   Remaining: ${remaining.length}\n`);

      const limit = parseInt(args[1]) || remaining.length;
      const toProcess = remaining.slice(0, limit);

      console.log(`Processing ${toProcess.length} images...\n`);

      for (let i = 0; i < toProcess.length; i++) {
        console.log(`\n[${i + 1}/${toProcess.length}]`);
        await processImage(toProcess[i], log);

        // Rate limiting - wait 3 seconds between requests to avoid 429
        if (i < toProcess.length - 1) {
          await sleep(3000);
        }
      }

      console.log("\n✨ Processing complete!");
      console.log(`   Processed: ${log.processed.length}`);
      console.log(`   Failed: ${log.failed.length}`);
      break;

    case "upload":
      // Upload images directly without background removal
      const uploadLog = loadProcessedLog();
      const imagesToUpload = getNewImages();

      // Filter out already uploaded
      if (!uploadLog.uploaded) uploadLog.uploaded = [];
      const remainingUploads = imagesToUpload.filter(
        (img) => !uploadLog.uploaded.includes(img),
      );

      console.log(`\n📷 Found ${imagesToUpload.length} total images`);
      console.log(`   Already uploaded: ${uploadLog.uploaded.length}`);
      console.log(`   Remaining: ${remainingUploads.length}\n`);

      const uploadLimit = parseInt(args[1]) || remainingUploads.length;
      const toUpload = remainingUploads.slice(0, uploadLimit);

      console.log(
        `Uploading ${toUpload.length} images directly (no bg removal)...\n`,
      );

      for (let i = 0; i < toUpload.length; i++) {
        console.log(`[${i + 1}/${toUpload.length}]`);
        await uploadDirect(toUpload[i], uploadLog);
      }

      console.log("\n✨ Upload complete!");
      console.log(`   Uploaded: ${uploadLog.uploaded.length}`);
      if (uploadLog.uploadFailed) {
        console.log(`   Failed: ${uploadLog.uploadFailed.length}`);
      }
      break;

    case "match":
      // Show matches without updating
      await updateProductImages();
      break;

    case "update":
      // Match and update database
      const result = await updateProductImages();
      if (result.updates.length > 0) {
        const confirm = args[1] === "--confirm";
        if (confirm) {
          await applyUpdates(result.updates);
        } else {
          console.log("\nRun with --confirm to apply updates");
        }
      }
      break;

    case "cleanup":
      await cleanupOldImages();
      break;

    case "status":
      const statusLog = loadProcessedLog();
      console.log("\n📊 Processing Status:");
      console.log(`   Processed: ${statusLog.processed.length}`);
      console.log(`   Failed: ${statusLog.failed.length}`);
      if (statusLog.failed.length > 0) {
        console.log("\nFailed images:");
        statusLog.failed.forEach((f) =>
          console.log(`   - ${f.file}: ${f.error}`),
        );
      }
      break;

    case "reset":
      // Reset the processing log
      saveProcessedLog({ processed: [], failed: [], skipped: [] });
      console.log("✅ Processing log reset");
      break;

    default:
      console.log(`
📷 Image Processing Script for ByteForge

Commands:
  process [limit]     Process new images (remove bg, upload to Supabase)
                      Optional limit to process only N images

  match               Show product-to-image matches (dry run)

  update [--confirm]  Update database with matched images
                      Use --confirm to actually apply changes

  cleanup             Show unused images in Supabase

  status              Show processing status

  reset               Reset the processing log

Examples:
  node scripts/processNewImages.js process 10    # Process first 10 images
  node scripts/processNewImages.js match         # Show matches
  node scripts/processNewImages.js update --confirm  # Apply DB updates
      `);
  }
}

main().catch(console.error);
