import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function updateProductImagesToPng() {
  // Get all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, image");
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  let updated = 0;
  for (const product of products) {
    if (!product.image) continue;
    const ext = product.image.split(".").pop().toLowerCase();
    if (ext !== "png") {
      const pngName = product.image.replace(/\.[^.]+$/, ".png");
      const { error: updateError } = await supabase
        .from("products")
        .update({ image: pngName })
        .eq("id", product.id);
      if (updateError) {
        console.error(`Failed to update product ${product.id}:`, updateError);
      } else {
        console.log(
          `Updated product ${product.id}: ${product.image} -> ${pngName}`,
        );
        updated++;
      }
    }
  }
  console.log(`\nTotal updated: ${updated}`);
}

updateProductImagesToPng();
