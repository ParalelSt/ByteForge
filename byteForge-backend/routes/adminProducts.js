import express from "express";
import multer from "multer";
import supabase from "../supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Utility: get content type from file extension
function getContentType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const types = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
  };
  return types[ext] || "image/png";
}

/* 
==============================
  CREATE PRODUCT
==============================
POST /admin/products
==============================
*/
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock } = req.body;

    if (!name || !price)
      return res.status(400).json({ error: "Name and price required" });

    let imageFilename = null;

    if (req.file) {
      // Get extension from original filename
      const originalExt =
        req.file.originalname.split(".").pop()?.toLowerCase() || "png";
      const validExts = ["png", "jpg", "jpeg", "webp", "gif"];
      const ext = validExts.includes(originalExt) ? originalExt : "png";

      const newFileName =
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 8) +
        "." +
        ext;

      // Upload directly to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(`product_images/${newFileName}`, req.file.buffer, {
          contentType: getContentType(newFileName),
          upsert: false,
        });

      if (uploadError) throw uploadError;
      imageFilename = newFileName;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description: description ?? "",
          price,
          image: imageFilename,
          category: category ?? null,
          subcategory: subcategory ?? null,
          stock: stock ? parseInt(stock) : 0,
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "Product created",
      productId: data[0].id,
    });
  } catch (err) {
    console.error("Product creation error:", err.message || err);
    res.status(500).json({ error: err.message || "Failed to create product" });
  }
});

/* 
==============================
  GET ALL PRODUCTS
==============================
*/
router.get("/", async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* 
==============================
  GET SINGLE PRODUCT
==============================
*/
router.get("/:id", async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id);

    if (error) throw error;

    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* 
==============================
  UPDATE PRODUCT
==============================
PUT /admin/products/:id
==============================
*/
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock } = req.body;
    const productId = req.params.id;

    // Fetch old image
    const { data: oldProduct, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", productId);

    if (fetchError) throw fetchError;

    if (!oldProduct || oldProduct.length === 0)
      return res.status(404).json({ error: "Product not found" });

    let newImage = oldProduct[0].image;

    // If new image uploaded → remove old one + upload new one
    if (req.file) {
      // Get extension from original filename
      const originalExt =
        req.file.originalname.split(".").pop()?.toLowerCase() || "png";
      const validExts = ["png", "jpg", "jpeg", "webp", "gif"];
      const ext = validExts.includes(originalExt) ? originalExt : "png";

      const newFileName =
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 8) +
        "." +
        ext;

      // Upload directly to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(`product_images/${newFileName}`, req.file.buffer, {
          contentType: getContentType(newFileName),
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Delete old file from Supabase if exists
      if (newImage) {
        await supabase.storage
          .from("product_images")
          .remove([`product_images/${newImage}`])
          .catch(() => {}); // Ignore errors if file doesn't exist
      }

      newImage = newFileName;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        image: newImage,
        category: category ?? null,
        subcategory: subcategory ?? null,
        stock: stock !== undefined ? parseInt(stock) : undefined,
      })
      .eq("id", productId);

    if (error) throw error;

    res.json({ success: true, message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* 
==============================
  DELETE PRODUCT
==============================
DELETE /admin/products/:id
==============================
*/
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const { data: rows, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", productId);

    if (fetchError) throw fetchError;

    if (!rows || !rows.length)
      return res.status(404).json({ error: "Product not found" });

    const image = rows[0].image;

    // Delete image from Supabase Storage
    if (image) {
      await supabase.storage
        .from("product_images")
        .remove([`product_images/${image}`])
        .catch(() => {}); // Ignore errors if file doesn't exist
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

/* 
==============================
  TOGGLE FEATURED STATUS
==============================
PATCH /admin/products/:id/featured
==============================
*/
router.patch("/:id/featured", async (req, res) => {
  try {
    const { featured } = req.body;
    const productId = req.params.id;

    if (typeof featured !== "boolean") {
      return res.status(400).json({ error: "Featured must be a boolean" });
    }

    const { error } = await supabase
      .from("products")
      .update({ featured })
      .eq("id", productId);

    if (error) throw error;

    res.json({ success: true, message: "Featured status updated", featured });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update featured status" });
  }
});

export default router;
