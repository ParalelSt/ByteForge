/**
 * Script to find and remove duplicate products
 * Run with: node scripts/removeDuplicates.js
 */

import supabase from "../supabase.js";

async function findAndRemoveDuplicates() {
  try {
    console.log("Fetching all products...\n");

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    console.log(`Total products: ${products.length}\n`);

    // Group products by name (case-insensitive)
    const productsByName = {};
    for (const product of products) {
      const key = product.name.toLowerCase().trim();
      if (!productsByName[key]) {
        productsByName[key] = [];
      }
      productsByName[key].push(product);
    }

    // Find duplicates
    const duplicates = [];
    const toDelete = [];

    for (const [name, items] of Object.entries(productsByName)) {
      if (items.length > 1) {
        duplicates.push({ name, count: items.length, items });
        // Keep the first one (lowest ID), mark others for deletion
        for (let i = 1; i < items.length; i++) {
          toDelete.push(items[i]);
        }
      }
    }

    if (duplicates.length === 0) {
      console.log("✅ No duplicates found!");
      return;
    }

    console.log(`Found ${duplicates.length} products with duplicates:\n`);
    console.log("─".repeat(60));

    for (const dup of duplicates) {
      console.log(`\n"${dup.items[0].name}" - ${dup.count} copies:`);
      for (const item of dup.items) {
        const marker = item.id === dup.items[0].id ? "✓ KEEP" : "✗ DELETE";
        console.log(
          `  ID ${item.id}: ${marker} (${item.category}/${item.subcategory})`,
        );
      }
    }

    console.log("\n" + "─".repeat(60));
    console.log(`\nWill delete ${toDelete.length} duplicate products.`);
    console.log("\nDeleting duplicates...\n");

    // Delete duplicates
    let deleted = 0;
    for (const product of toDelete) {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (deleteError) {
        console.error(
          `✗ Failed to delete ID ${product.id}: ${deleteError.message}`,
        );
      } else {
        console.log(`✓ Deleted ID ${product.id}: "${product.name}"`);
        deleted++;
      }
    }

    console.log(`\n✅ Deleted ${deleted} duplicate products.`);

    // Final count
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    console.log(`\nRemaining products: ${count}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

findAndRemoveDuplicates();
