import supabase from "../supabase.js";

async function removeDuplicatesAndStandardizeImages() {
  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  // Remove duplicates by name and image
  const seenNames = new Set();
  const seenImages = new Set();
  let duplicates = [];
  for (const p of products) {
    const nameKey = p.name.trim().toLowerCase();
    const imageKey = p.image?.trim().toLowerCase();
    if (seenNames.has(nameKey) || (imageKey && seenImages.has(imageKey))) {
      duplicates.push(p.id);
    } else {
      seenNames.add(nameKey);
      if (imageKey) seenImages.add(imageKey);
    }
  }

  // Delete duplicate products
  if (duplicates.length > 0) {
    console.log("Deleting duplicates:", duplicates);
    for (const id of duplicates) {
      await supabase.from("products").delete().eq("id", id);
      console.log(`Deleted product ID: ${id}`);
    }
  } else {
    console.log("No duplicates found.");
  }

  // Standardize image file names in DB to .png
  for (const p of products) {
    if (p.image && !p.image.endsWith(".png")) {
      const pngName = p.image.replace(/\.[^.]+$/, ".png");
      await supabase.from("products").update({ image: pngName }).eq("id", p.id);
      console.log(`Standardized image for product ID: ${p.id} to ${pngName}`);
    }
  }
}

removeDuplicatesAndStandardizeImages();
