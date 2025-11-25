import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const IMAGES_DIR = path.join("images/product_images");
const BACKUP_DIR = path.join("images_backup");

async function removeBackground(inputPath, outputPath) {
  try {
    console.log("Processing:", inputPath);

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(inputPath));
    formData.append("size", "auto");

    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": process.env.REMOVE_BG_KEY,
      },
      responseType: "arraybuffer",
    });

    fs.writeFileSync(outputPath, response.data);

    console.log("✔ Saved:", outputPath);
  } catch (err) {
    console.error("✖ Failed:", inputPath, err.response?.status || err.message);
    if (err.response?.status === 400) {
      console.error(
        "   (Unsupported format - remove.bg supports JPG, PNG, WebP only)"
      );
    }
  }
}

async function processAllImages() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }

  const files = fs.readdirSync(IMAGES_DIR);
  const supportedFormats = [".jpg", ".jpeg", ".png", ".webp"];

  for (const file of files) {
    const oldPath = path.join(IMAGES_DIR, file);

    if (!fs.statSync(oldPath).isFile()) continue;

    const hasExt = file.includes(".");
    if (!hasExt) continue;

    const ext = path.extname(file).toLowerCase();
    if (!supportedFormats.includes(ext)) {
      console.log(
        `⊘ Skipping ${file} - unsupported format (${ext}). remove.bg supports: JPG, PNG, WebP`
      );
      continue;
    }

    const newFile = file.replace(/\.\w+$/, ".png");
    const newPath = path.join(IMAGES_DIR, newFile);

    // Backup original
    fs.copyFileSync(oldPath, path.join(BACKUP_DIR, file));

    await removeBackground(oldPath, newPath);
  }

  console.log("\n🎉 Finished removing backgrounds from existing images!");
}

processAllImages();
