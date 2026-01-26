import supabase from "../supabase.js";

async function removeDuplicatesAndFixDX() {
  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
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
  // Fix casing for DX in names
  for (const p of products) {
    if (p.name && p.name.match(/\bdx\b/i)) {
      const fixedName = p.name.replace(/\bdx\b/gi, "DX");
      if (fixedName !== p.name) {
        await supabase
          .from("products")
          .update({ name: fixedName })
          .eq("id", p.id);
        console.log(
          `Fixed DX casing for product ID: ${p.id} to '${fixedName}'`,
        );
      }
    }
  }
}

removeDuplicatesAndFixDX();
