/**
 * Script to set realistic stock values for all products
 * Run with: node scripts/setProductStock.js
 */

import supabase from "../supabase.js";

// Realistic stock ranges by category
const stockRanges = {
  // Games tend to have unlimited digital stock, but we'll simulate physical copies
  Games: { min: 15, max: 50 },
  "PC Games": { min: 20, max: 100 },
  "Console Games": { min: 10, max: 40 },
  "Gift Cards": { min: 50, max: 200 },

  // Components have lower stock (expensive, large items)
  "PC Components": { min: 5, max: 25 },
  Case: { min: 8, max: 20 },
  SSD: { min: 15, max: 40 },
  "Power Supply": { min: 10, max: 30 },
  CPUs: { min: 5, max: 15 },
  GPUs: { min: 3, max: 12 },
  RAM: { min: 20, max: 50 },
  Storage: { min: 15, max: 35 },

  // Peripherals - moderate stock
  Peripherals: { min: 15, max: 45 },
  Keyboards: { min: 12, max: 35 },
  Mice: { min: 20, max: 50 },
  Headsets: { min: 10, max: 30 },
  Mousepads: { min: 25, max: 60 },

  // Cases
  "PC Cases": { min: 8, max: 20 },
  "ATX Cases": { min: 6, max: 15 },
  "mATX Cases": { min: 8, max: 18 },
  "Mini-ITX Cases": { min: 5, max: 12 },

  // Phones - lower stock
  Phones: { min: 5, max: 20 },
  "Android Phones": { min: 8, max: 25 },
  iPhones: { min: 5, max: 15 },
  "Gaming Phones": { min: 3, max: 10 },

  // Accessories - higher stock
  Accessories: { min: 20, max: 80 },
  "Monitor Lights": { min: 15, max: 40 },
  "USB Hubs": { min: 25, max: 60 },
  Cables: { min: 50, max: 150 },
  Mounts: { min: 10, max: 30 },

  // Bundles - limited
  Bundles: { min: 5, max: 15 },

  // Default
  default: { min: 10, max: 30 },
};

function getRandomStock(category, subcategory) {
  // Try subcategory first, then category, then default
  const range =
    stockRanges[subcategory] || stockRanges[category] || stockRanges.default;

  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

async function setProductStock() {
  try {
    console.log("Fetching products...");

    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, name, category, subcategory, stock");

    if (fetchError) throw fetchError;

    console.log(`Found ${products.length} products\n`);

    const updates = [];

    for (const product of products) {
      const newStock = getRandomStock(product.category, product.subcategory);

      updates.push({
        id: product.id,
        name: product.name,
        oldStock: product.stock,
        newStock: newStock,
      });

      // Update in database
      const { error } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", product.id);

      if (error) {
        console.error(`Failed to update ${product.name}:`, error.message);
      } else {
        console.log(
          `✓ ${product.name}: ${product.stock ?? 0} → ${newStock} (${product.category}/${product.subcategory})`,
        );
      }
    }

    console.log(`\n✅ Updated stock for ${updates.length} products`);
  } catch (error) {
    console.error("Error:", error);
  }
}

setProductStock();
