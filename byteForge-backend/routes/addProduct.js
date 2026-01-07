import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import supabase from "../supabase.js";

dotenv.config();
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const outputFilename = Date.now() + ".png";

    // Remove background
    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: req.file.buffer,
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_KEY,
      },
      responseType: "arraybuffer",
    });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(`product_images/${outputFilename}`, response.data, {
        contentType: "image/png",
        upsert: false,
      });
    if (uploadError) throw uploadError;

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
