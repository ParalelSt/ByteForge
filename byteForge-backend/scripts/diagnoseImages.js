import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import https from "https";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD" }, (res) => {
      resolve(res.statusCode);
    });
    req.on("error", () => resolve("ERROR"));
    req.end();
  });
}

async function diagnose() {
  console.log("=== DEEP IMAGE DIAGNOSIS ===\n");
  console.log("Supabase URL:", process.env.SUPABASE_URL);
  console.log("");

  // Get storage files
  const { data: files, error: storageError } = await supabase.storage
    .from("product_images")
    .list("", { limit: 1000 });
  if (storageError) {
    console.error("Storage error:", storageError);
    return;
  }

  const storageFiles = files.filter((f) => f.name !== "product_images");
  console.log("Files in storage:", storageFiles.length);

  // Get products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, image");
  console.log("Products in DB:", products.length);
  console.log("");

  // Create lookup
  const storageSet = new Set(storageFiles.map((f) => f.name));

  // Find products where image is NOT in storage
  const missing = [];
  const working = [];

  for (const p of products) {
    if (p.image && storageSet.has(p.image)) {
      working.push(p);
    } else {
      missing.push(p);
    }
  }

  console.log("Products with matching images:", working.length);
  console.log("Products with MISSING images:", missing.length);
  console.log("");

  if (missing.length > 0) {
    console.log("=== MISSING IMAGES ===\n");
    for (const p of missing.slice(0, 30)) {
      console.log(`[${p.id}] ${p.name}`);
      console.log(`   image field: "${p.image || "(empty)"}"`);

      // Try to find similar
      if (p.image) {
        const base = p.image.replace(/\.[^.]+$/, "");
        const similar = storageFiles.filter(
          (f) =>
            f.name.includes(base) ||
            base.includes(f.name.replace(/\.[^.]+$/, "")),
        );
        if (similar.length > 0) {
          console.log(
            `   similar in storage: ${similar.map((f) => f.name).join(", ")}`,
          );
        }
      }
      console.log("");
    }
  }

  // Test actual HTTP accessibility for some working ones
  console.log("=== TESTING HTTP ACCESS ===\n");
  const testSample = working.slice(0, 10);
  for (const p of testSample) {
    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/product_images/${p.image}`;
    const status = await testUrl(url);
    const statusIcon = status === 200 ? "✓" : "✗";
    console.log(`${statusIcon} [${p.id}] ${p.name} => ${status}`);
  }
}

diagnose();
