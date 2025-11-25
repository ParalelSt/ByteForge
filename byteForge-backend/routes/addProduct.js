import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const inputPath = req.file.path;
    const outputFilename = req.file.filename + ".png";
    const outputPath = path.join("images/product_images", outputFilename);

    // Remove background
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

    // Insert into MySQL
    const [result] = await db.execute(
      "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)",
      [name, description ?? "", price, outputFilename]
    );

    return res.json({
      success: true,
      product: {
        id: result.insertId,
        name,
        description,
        price,
        image: outputFilename,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add product" });
  }
});

export default router;
