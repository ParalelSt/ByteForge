import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import supabase from "../supabase.js";

dotenv.config();
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;

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

    // Insert into Supabase
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description: description ?? "",
          price,
          image: outputFilename,
          category: category ?? "",
          subcategory: subcategory ?? "",
        },
      ])
      .select();

    if (error) throw error;

    return res.json({
      success: true,
      product: {
        id: data[0].id,
        name,
        description,
        price,
        image: outputFilename,
        category,
        subcategory,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add product" });
  }
});

export default router;
