import FormData from "form-data";

import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility: get base name (no extension)
function getBaseName(filename) {
  return filename.replace(/\.[^.]+$/, "").toLowerCase();
}

// Utility: get extension
function getExt(filename) {
  return filename.split(".").pop().toLowerCase();
}

// Supported image extensions
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "avif"];

async function checkAndRemoveNonPngs() {
  const localPath = path.join(__dirname, "..", "images", "product_images");
  const localFiles = fs.existsSync(localPath) ? fs.readdirSync(localPath) : [];

  // Group by base name
  const groups = {};
  for (const file of localFiles) {
    const ext = getExt(file);
    if (!IMAGE_EXTS.includes(ext)) continue;
    const base = getBaseName(file);
    if (!groups[base]) groups[base] = [];
    groups[base].push({ file, ext });
  }

  // Find sets with PNG and at least one other format
  const toRemove = [];
  const toProcess = [];
  for (const [base, files] of Object.entries(groups)) {
    const hasPng = files.some((f) => f.ext === "png");
    const others = files.filter((f) => f.ext !== "png");
    if (hasPng && others.length > 0) {
      // Mark non-pngs for removal
      toRemove.push(...others.map((f) => path.join(localPath, f.file)));
    } else if (!hasPng && others.length > 0) {
      // Mark for remove.bg processing (convert to PNG)
      toProcess.push({ base, files: others });
    }
  }

  // Log what will be removed
  console.log("=== Non-PNG images to remove (leave PNG only) ===");
  toRemove.forEach((f) => console.log(f));
  console.log("\n=== Images needing PNG conversion (no PNG present) ===");
  toProcess.forEach((g) => {
    console.log(`Base: ${g.base}`);
    g.files.forEach((f) => console.log(`   - ${f.file}`));
  });

  // Remove non-pngs (local only, not DB)
  for (const file of toRemove) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } catch (e) {
      console.error(`Failed to delete: ${file}`, e);
    }
  }

  // For toProcess: you would call remove.bg API here for each file, save as PNG
  if (toProcess.length > 0) {
    const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
    if (!REMOVE_BG_API_KEY) {
      console.error(
        "REMOVE_BG_API_KEY not set in environment. Skipping remove.bg step.",
      );
      return;
    }
    for (const group of toProcess) {
      for (const fileObj of group.files) {
        const inputPath = path.join(localPath, fileObj.file);
        const outputPath = path.join(localPath, group.base + ".png");
        try {
          const formData = new FormData();
          formData.append("image_file", fs.createReadStream(inputPath));
          formData.append("size", "auto");

          const response = await axios({
            method: "post",
            url: "https://api.remove.bg/v1.0/removebg",
            data: formData,
            responseType: "arraybuffer",
            headers: {
              ...formData.getHeaders(),
              "X-Api-Key": REMOVE_BG_API_KEY,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          });

          if (response.status === 200) {
            fs.writeFileSync(outputPath, response.data);
            console.log(
              `remove.bg: Converted ${fileObj.file} -> ${group.base}.png`,
            );
            // Delete original after conversion
            fs.unlinkSync(inputPath);
            console.log(`Deleted original: ${inputPath}`);
          } else {
            console.error(
              `remove.bg failed for ${fileObj.file}:`,
              response.status,
              response.statusText,
            );
          }
        } catch (err) {
          console.error(`remove.bg error for ${fileObj.file}:`, err.message);
        }
      }
    }
  }
}

// Run the new check-and-remove script
checkAndRemoveNonPngs();
