import express from "express";
import multer from "multer";
import supabase from "../supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /bulk-upload/images
 * Upload multiple images directly to Supabase Storage (no bg removal)
 *
 * Body: multipart/form-data with 'images' field containing multiple files
 * Returns: Array of uploaded image filenames and URLs
 */
router.post("/images", upload.array("images", 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Generate unique filename
        const ext = file.originalname.split(".").pop();
        const filename = `${Date.now()}-${file.originalname}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("product_images")
          .upload(`product_images/${filename}`, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          errors.push({ file: file.originalname, error: error.message });
          continue;
        }

        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/product_images/${data.path}`;

        results.push({
          originalName: file.originalname,
          filename: filename,
          path: data.path,
          url: publicUrl,
        });
      } catch (err) {
        errors.push({ file: file.originalname, error: err.message });
      }
    }

    res.json({
      success: true,
      uploaded: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

/**
 * POST /bulk-upload/assign
 * Assign uploaded images to products by matching filename to product name
 *
 * Body: { mappings: [{ productId: number, filename: string }] }
 */
router.post("/assign", async (req, res) => {
  try {
    const { mappings } = req.body;

    if (!mappings || !Array.isArray(mappings)) {
      return res.status(400).json({ error: "Mappings array required" });
    }

    const results = [];
    const errors = [];

    for (const mapping of mappings) {
      try {
        const { error } = await supabase
          .from("products")
          .update({ image: mapping.filename })
          .eq("id", mapping.productId);

        if (error) {
          errors.push({ productId: mapping.productId, error: error.message });
        } else {
          results.push({
            productId: mapping.productId,
            filename: mapping.filename,
          });
        }
      } catch (err) {
        errors.push({ productId: mapping.productId, error: err.message });
      }
    }

    res.json({
      success: true,
      updated: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error("Assign images error:", error);
    res.status(500).json({ error: "Failed to assign images" });
  }
});

/**
 * POST /bulk-upload/stock
 * Set stock for multiple products at once
 *
 * Body: { updates: [{ productId: number, stock: number }] }
 */
router.post("/stock", async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "Updates array required" });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { error } = await supabase
          .from("products")
          .update({ stock: update.stock })
          .eq("id", update.productId);

        if (error) {
          errors.push({ productId: update.productId, error: error.message });
        } else {
          results.push({ productId: update.productId, stock: update.stock });
        }
      } catch (err) {
        errors.push({ productId: update.productId, error: err.message });
      }
    }

    res.json({
      success: true,
      updated: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error("Bulk stock update error:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

/**
 * GET /bulk-upload/products
 * Get all products with their current image and stock status
 */
router.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, image, stock, category, subcategory")
      .order("name", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * POST /bulk-upload/replace-image
 * Upload a single image and assign it to a product (by ID or name)
 *
 * Body: multipart/form-data with:
 *   - image: file
 *   - productId: number (optional)
 *   - productName: string (optional, used if productId not provided)
 */
router.post("/replace-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { productId, productName } = req.body;

    if (!productId && !productName) {
      return res
        .status(400)
        .json({ error: "productId or productName required" });
    }

    // Find the product
    let query = supabase.from("products").select("id, name, image");

    if (productId) {
      query = query.eq("id", productId);
    } else {
      query = query.ilike("name", productName);
    }

    const { data: products, error: findError } = await query;

    if (findError) throw findError;
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = products[0];

    // Delete old image from storage if exists
    if (product.image) {
      await supabase.storage
        .from("product_images")
        .remove([`product_images/${product.image}`])
        .catch(() => {}); // Ignore errors
    }

    // Upload new image
    const filename = `${Date.now()}-${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(`product_images/${filename}`, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Update product with new image
    const { error: updateError } = await supabase
      .from("products")
      .update({ image: filename })
      .eq("id", product.id);

    if (updateError) throw updateError;

    res.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        oldImage: product.image,
        newImage: filename,
      },
      url: `${process.env.SUPABASE_URL}/storage/v1/object/public/product_images/product_images/${filename}`,
    });
  } catch (error) {
    console.error("Replace image error:", error);
    res.status(500).json({ error: "Failed to replace image" });
  }
});

/**
 * POST /bulk-upload/replace-images
 * Upload multiple images and auto-match to products by filename
 * Filename should match product name (e.g., "Logitech G502.png" matches "Logitech G502")
 *
 * Body: multipart/form-data with 'images' field
 */
router.post(
  "/replace-images",
  upload.array("images", 100),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      // Get all products
      const { data: products, error: fetchError } = await supabase
        .from("products")
        .select("id, name, image");

      if (fetchError) throw fetchError;

      const results = [];
      const errors = [];
      const notFound = [];

      for (const file of req.files) {
        // Extract product name from filename (remove extension)
        const nameFromFile = file.originalname.replace(/\.[^.]+$/, "").trim();

        // Find matching product (case-insensitive)
        const product = products.find(
          (p) => p.name.toLowerCase() === nameFromFile.toLowerCase(),
        );

        if (!product) {
          notFound.push({
            filename: file.originalname,
            searchedName: nameFromFile,
          });
          continue;
        }

        try {
          // Delete old image if exists
          if (product.image) {
            await supabase.storage
              .from("product_images")
              .remove([`product_images/${product.image}`])
              .catch(() => {});
          }

          // Upload new image
          const filename = `${Date.now()}-${file.originalname}`;
          const { error: uploadError } = await supabase.storage
            .from("product_images")
            .upload(`product_images/${filename}`, file.buffer, {
              contentType: file.mimetype,
              upsert: true,
            });

          if (uploadError) {
            errors.push({ product: product.name, error: uploadError.message });
            continue;
          }

          // Update product
          const { error: updateError } = await supabase
            .from("products")
            .update({ image: filename })
            .eq("id", product.id);

          if (updateError) {
            errors.push({ product: product.name, error: updateError.message });
            continue;
          }

          results.push({
            productId: product.id,
            productName: product.name,
            filename: filename,
          });
        } catch (err) {
          errors.push({ product: product.name, error: err.message });
        }
      }

      res.json({
        success: true,
        matched: results.length,
        failed: errors.length,
        notFound: notFound.length,
        results,
        errors,
        notFound,
      });
    } catch (error) {
      console.error("Replace images error:", error);
      res.status(500).json({ error: "Failed to replace images" });
    }
  },
);

export default router;
