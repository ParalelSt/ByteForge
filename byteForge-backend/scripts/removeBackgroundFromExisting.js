import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const IMAGES_DIR = path.join("images");
const BACKUP_DIR = path.join("images_backup");

async function removeBackground(inputPath, outputPath) {
  try {
    console.log("Processing:", inputPath);

    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: {
        image_file: fs.createReadStream(inputPath),
        size: "auto",
      },
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_KEY,
      },
      responseType: "arraybuffer",
    });

    fs.writeFileSync(outputPath, response.data);

    console.log("✔ Saved:", outputPath);
  } catch (err) {
    console.error("✖ Failed:", inputPath, err.message);
  }
}

async function processAllImages() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }

  const files = fs.readdirSync(IMAGES_DIR);

  for (const file of files) {
    const oldPath = path.join(IMAGES_DIR, file);

    if (!fs.statSync(oldPath).isFile()) continue;

    const hasExt = file.includes(".");
    if (!hasExt) continue;

    const newFile = file.replace(/\.\w+$/, ".png");
    const newPath = path.join(IMAGES_DIR, newFile);

    // Backup original
    fs.copyFileSync(oldPath, path.join(BACKUP_DIR, file));

    await removeBackground(oldPath, newPath);
  }

  console.log("\n🎉 Finished removing backgrounds from existing images!");
}

processAllImages();
