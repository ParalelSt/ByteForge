import supabase from "../supabase.js";

async function removeStrictDuplicates() {
  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  // Remove strict duplicates by both name and image
  const seen = new Set();
  let duplicates = [];
  for (const p of products) {
    const key = `${p.name.trim().toLowerCase()}|${p.image?.trim().toLowerCase()}`;
    if (seen.has(key)) {
      duplicates.push(p.id);
    } else {
      seen.add(key);
    }
  }
  // Delete duplicate products
  if (duplicates.length > 0) {
    console.log("Deleting strict duplicates:", duplicates);
    for (const id of duplicates) {
      await supabase.from("products").delete().eq("id", id);
      console.log(`Deleted product ID: ${id}`);
    }
  } else {
    console.log("No strict duplicates found.");
  }
}

removeStrictDuplicates();
