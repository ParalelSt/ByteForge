import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// POST /upload-product
router.post("/upload-product", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputFilename = req.file.filename + ".png";
    const outputPath = path.join("images", outputFilename);

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
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      filename: outputFilename,
    });
  } catch (error) {
    console.error("Error removing background:", error);
    res.status(500).json({ success: false });
  }
});

export default router;
