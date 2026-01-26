import supabase from "../supabase.js";

async function previewProductsToDelete() {
  const namesToDelete = ["Work From Home Bundle", "Office Starter Bundle"];
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image, description, category, subcategory")
    .in("name", namesToDelete);
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  if (!products || products.length === 0) {
    console.log("No products found for deletion.");
    return;
  }
  console.log("Products to be deleted:");
  for (const p of products) {
    console.log(
      `ID: ${p.id}, Name: ${p.name}, Image: ${p.image}, Desc: ${p.description}, Cat: ${p.category}, Subcat: ${p.subcategory}`,
    );
  }
}

previewProductsToDelete();
