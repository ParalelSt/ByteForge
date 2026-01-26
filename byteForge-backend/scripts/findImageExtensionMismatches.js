import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function findMismatches() {
  // Get all files in storage
  const { data: files } = await supabase.storage
    .from("product_images")
    .list("", { limit: 1000 });
  const storageFiles = files
    .filter((f) => f.name !== "product_images")
    .map((f) => f.name);
  const storageBaseMap = {};
  for (const f of storageFiles) {
    const base = f.replace(/\.[^.]+$/, "");
    if (!storageBaseMap[base]) storageBaseMap[base] = [];
    storageBaseMap[base].push(f);
  }

  // Get all products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, image");

  const mismatches = [];
  for (const p of products) {
    if (!p.image) continue;
    if (!storageFiles.includes(p.image)) {
      // Try to find a file with same base name but different extension
      const base = p.image.replace(/\.[^.]+$/, "");
      const candidates = storageBaseMap[base] || [];
      if (candidates.length > 0) {
        mismatches.push({
          id: p.id,
          name: p.name,
          dbImage: p.image,
          candidates,
        });
      }
    }
  }

  console.log("=== IMAGE EXTENSION MISMATCHES ===");
  if (mismatches.length === 0) {
    console.log("No mismatches found!");
    return;
  }
  for (const m of mismatches) {
    console.log(`[${m.id}] ${m.name}`);
    console.log(`   DB image: ${m.dbImage}`);
    console.log(`   Storage candidates: ${m.candidates.join(", ")}`);
    console.log("");
  }
  console.log(`Total mismatches: ${mismatches.length}`);
}

findMismatches();
