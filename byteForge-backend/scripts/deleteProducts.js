import supabase from "../supabase.js";

async function deleteProducts() {
  const namesToDelete = ["Work From Home Bundle", "Office Starter Bundle"];
  const { data: products, error } = await supabase
    .from("products")
    .select("id, image")
    .in("name", namesToDelete);
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  if (!products || products.length === 0) {
    console.log("No products found for deletion.");
    return;
  }
  for (const p of products) {
    // Delete image from storage
    if (p.image) {
      await supabase.storage
        .from("product_images")
        .remove([`product_images/${p.image}`])
        .catch(() => {});
    }
    // Delete product from database
    const { error: delError } = await supabase
      .from("products")
      .delete()
      .eq("id", p.id);
    if (delError) {
      console.error(`Failed to delete product ${p.id}:`, delError);
    } else {
      console.log(`Deleted product ${p.id}`);
    }
  }
}

deleteProducts();
