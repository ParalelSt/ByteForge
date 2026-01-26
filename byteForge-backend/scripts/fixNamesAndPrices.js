import supabase from "../supabase.js";

const nameCorrections = [
  { name: "Benq E Reading Lamp", price: 49.99 },
  { name: "Bequiet 500DX", price: 109.99 },
  { name: "Bequiet Silent Base 802", price: 159.99 },
  { name: "Bundle RGB Gaming", price: 89.99 },
  { name: "Case Coolermaster NR200P", price: 99.99 },
  { name: "Razer BlackWidow V4", price: 229.99 },
  { name: "Lian Li O11 Dynamic", price: 139.99 },
  { name: "ASUS ROG Strix B650", price: 299.99 },
];

async function fixNamesAndPrices() {
  for (const correction of nameCorrections) {
    // Find product by name (case-insensitive)
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name")
      .ilike("name", `%${correction.name.toLowerCase()}%`);
    if (error) {
      console.error(`Error fetching product ${correction.name}:`, error);
      continue;
    }
    if (products && products.length > 0) {
      for (const p of products) {
        await supabase
          .from("products")
          .update({ name: correction.name, price: correction.price })
          .eq("id", p.id);
        console.log(
          `Updated product ${p.id} to name '${correction.name}' and price ${correction.price}`,
        );
      }
    } else {
      console.log(`No product found for correction: ${correction.name}`);
    }
  }
}

fixNamesAndPrices();
