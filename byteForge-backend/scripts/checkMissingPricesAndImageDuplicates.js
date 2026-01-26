import supabase from "../supabase.js";

async function checkMissingPricesAndImageDuplicates() {
  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, image");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  // Find products with missing price (0 or null)
  const missingPrice = products.filter((p) => !p.price || p.price === 0);
  console.log(`Products missing price (${missingPrice.length}):`);
  missingPrice.forEach((p) => console.log(`ID: ${p.id}, Name: ${p.name}`));

  // Find products with missing image
  const missingImage = products.filter(
    (p) => !p.image || p.image.trim() === "",
  );
  // Check for duplicates by name among missing image products
  const nameCount = {};
  missingImage.forEach((p) => {
    const key = p.name.trim().toLowerCase();
    nameCount[key] = (nameCount[key] || 0) + 1;
  });
  const duplicateNames = Object.entries(nameCount).filter(
    ([_, count]) => count > 1,
  );
  console.log(
    `Products missing image and duplicated by name (${duplicateNames.length}):`,
  );
  duplicateNames.forEach(([name, count]) => {
    const ids = missingImage
      .filter((p) => p.name.trim().toLowerCase() === name)
      .map((p) => p.id);
    console.log(`Name: ${name}, Count: ${count}, IDs: ${ids.join(", ")}`);
  });
}

checkMissingPricesAndImageDuplicates();
