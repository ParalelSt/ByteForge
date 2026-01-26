import supabase from "../supabase.js";

const priceCorrections = [
  { name: "BenQ e-Reading Lamp", price: 99.99 },
  { name: "GFUEL Hype Sauce", price: 35.99 },
  { name: "GFUEL PewDiePie Shaker", price: 12.99 },
];

async function removeNameDuplicatesAndFixPrices() {
  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  // Remove duplicates by name (keep first occurrence)
  const seenNames = new Set();
  let duplicates = [];
  for (const p of products) {
    const nameKey = p.name.trim().toLowerCase();
    if (seenNames.has(nameKey)) {
      duplicates.push(p.id);
    } else {
      seenNames.add(nameKey);
    }
  }
  if (duplicates.length > 0) {
    console.log("Deleting name duplicates:", duplicates);
    for (const id of duplicates) {
      await supabase.from("products").delete().eq("id", id);
      console.log(`Deleted product ID: ${id}`);
    }
  } else {
    console.log("No name duplicates found.");
  }
  // Fix missing prices for key products
  for (const correction of priceCorrections) {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price")
      .ilike("name", `%${correction.name.toLowerCase()}%`);
    if (error) {
      console.error(`Error fetching product ${correction.name}:`, error);
      continue;
    }
    if (products && products.length > 0) {
      for (const p of products) {
        if (!p.price || p.price === 0) {
          await supabase
            .from("products")
            .update({ price: correction.price })
            .eq("id", p.id);
          console.log(`Updated product ${p.id} to price ${correction.price}`);
        }
      }
    }
  }
}

removeNameDuplicatesAndFixPrices();
