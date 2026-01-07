import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import supabase from "../supabase.js";

dotenv.config();

const router = express.Router();

// Use memory storage always (will upload to Supabase Storage)
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload-product
router.post("/upload-product", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const outputFilename = filename.replace(/\.[^.]+$/, ".png");

    // Remove background using remove.bg API
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
    const { data, error } = await supabase.storage
      .from("product_images")
      .upload(`product_images/${outputFilename}`, response.data, {
        contentType: "image/png",
        upsert: false,
      });

    if (error) throw error;

    res.json({
      success: true,
      filename: outputFilename,
      url: `${process.env.SUPABASE_URL}/storage/v1/object/public/product_images/${data.path}`,
    });
  } catch (error) {
    console.error("Error removing background:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
