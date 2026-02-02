import express from "express";
import multer from "multer";
import supabase from "../supabase.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from("promos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch promos" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and desription required" });
    }

    let imageFileName = null;

    if (req.file) {
      // Get the file extension from original filename, default to png
      const originalExt =
        req.file.originalname.split(".").pop()?.toLowerCase() || "png";
      const validExts = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
      const ext = validExts.includes(originalExt) ? originalExt : "png";

      // Determine content type
      const contentTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
        gif: "image/gif",
        svg: "image/svg+xml",
      };

      const newFileName = Date.now() + "." + ext;
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("promo_images")
        .upload(`promo_images/${newFileName}`, req.file.buffer, {
          contentType: contentTypes[ext] || "image/png",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      imageFileName = newFileName;
    }

    // Deactivate all other promos
    await supabase.from("promos").update({ is_active: false }).neq("id", 0);

    const { data: result, error } = await supabase
      .from("promos")
      .insert([
        {
          title,
          description,
          image: imageFileName,
          link,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "Promo created and set as active",
      promoId: result[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create promo" });
  }
});

router.patch("/:id/activate", async (req, res) => {
  try {
    const promoId = req.params.id;

    // Deactivate all
    await supabase.from("promos").update({ is_active: false }).neq("id", 0);

    // Activate this one
    const { data, error } = await supabase
      .from("promos")
      .update({ is_active: true })
      .eq("id", promoId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Promo not found" });
    }

    res.json({ success: true, message: "Promo activated", promoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to activate promo" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const promoId = req.params.id;
    const { title, description, link } = req.body;

    const { data: existing, error: fetchError } = await supabase
      .from("promos")
      .select("*")
      .eq("id", promoId);

    if (fetchError) throw fetchError;
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: "Promo not found" });
    }

    let imageFileName = existing[0].image;

    if (req.file) {
      if (existing[0].image) {
        // Delete old image from Supabase Storage
        await supabase.storage
          .from("promo_images")
          .remove([`promo_images/${existing[0].image}`])
          .catch(() => {}); // Ignore errors if file doesn't exist
      }

      // Get the file extension from original filename, default to png
      const originalExt =
        req.file.originalname.split(".").pop()?.toLowerCase() || "png";
      const validExts = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
      const ext = validExts.includes(originalExt) ? originalExt : "png";

      // Determine content type
      const contentTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
        gif: "image/gif",
        svg: "image/svg+xml",
      };

      const newFileName = Date.now() + "." + ext;
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("promo_images")
        .upload(`promo_images/${newFileName}`, req.file.buffer, {
          contentType: contentTypes[ext] || "image/png",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      imageFileName = newFileName;
    }

    const { error } = await supabase
      .from("promos")
      .update({
        title,
        description,
        image: imageFileName,
        link,
      })
      .eq("id", promoId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Promo updated successfully",
      promoId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to update promo" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const promoId = req.params.id;

    const { data: existing, error: fetchError } = await supabase
      .from("promos")
      .select("*")
      .eq("id", promoId);

    if (fetchError) throw fetchError;
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: "Promo not found" });
    }

    if (existing[0].image) {
      // Delete image from Supabase Storage
      await supabase.storage
        .from("promo_images")
        .remove([`promo_images/${existing[0].image}`])
        .catch(() => {}); // Ignore errors if file doesn't exist
    }

    const { error } = await supabase.from("promos").delete().eq("id", promoId);

    if (error) throw error;

    res.json({ success: true, message: "Promo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to delete promo" });
  }
});

export default router;
