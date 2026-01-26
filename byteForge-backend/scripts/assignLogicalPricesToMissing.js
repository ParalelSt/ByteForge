import supabase from "../supabase.js";

// Logical price ranges by keyword/category
const priceLogic = [
  { keywords: ["pc", "desktop", "laptop", "notebook"], min: 499, max: 1499 },
  { keywords: ["gpu", "graphics", "video card"], min: 199, max: 799 },
  { keywords: ["cpu", "processor"], min: 99, max: 499 },
  { keywords: ["monitor", "display", "screen"], min: 99, max: 399 },
  { keywords: ["keyboard", "keypad"], min: 29, max: 199 },
  { keywords: ["mouse", "mice"], min: 19, max: 129 },
  { keywords: ["headset", "headphones", "earbuds"], min: 29, max: 199 },
  { keywords: ["controller", "console"], min: 49, max: 399 },
  { keywords: ["case", "chassis"], min: 49, max: 199 },
  { keywords: ["fan", "cooler", "cooling"], min: 9, max: 79 },
  { keywords: ["lamp", "light"], min: 19, max: 99 },
  { keywords: ["bundle", "kit", "set"], min: 49, max: 199 },
  { keywords: ["pad", "mousepad", "mat"], min: 5, max: 39 },
  { keywords: ["cable", "adapter"], min: 3, max: 29 },
  { keywords: ["speaker", "audio"], min: 19, max: 149 },
  { keywords: ["promo", "energy", "gfuel"], min: 9, max: 39 },
];

function getLogicalPrice(name) {
  const lower = name.toLowerCase();
  for (const logic of priceLogic) {
    if (logic.keywords.some((kw) => lower.includes(kw))) {
      // Random price in range
      return (Math.random() * (logic.max - logic.min) + logic.min).toFixed(2);
    }
  }
  // Default fallback
  return (Math.random() * (49 - 19) + 19).toFixed(2);
}

async function assignLogicalPricesToMissing() {
  // Fetch all products with missing price (null, 0, or not a number)
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  const missingPrice = products.filter(
    (p) => !p.price || p.price === 0 || isNaN(Number(p.price)),
  );
  console.log(`Found ${missingPrice.length} products missing price.`);
  for (const p of missingPrice) {
    const logicalPrice = Number(getLogicalPrice(p.name));
    const { error: updateError } = await supabase
      .from("products")
      .update({ price: logicalPrice })
      .eq("id", p.id);
    if (updateError) {
      console.error(
        `Failed to update price for ${p.name} (${p.id}):`,
        updateError,
      );
    } else {
      console.log(`Set price for ${p.name} (${p.id}) to €${logicalPrice}`);
    }
  }
}

assignLogicalPricesToMissing();
