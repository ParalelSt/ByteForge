import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const IMAGE_EXTS = ["jpg", "jpeg", "webp", "avif"];

async function removeNonPngFromSupabase() {
  const { data: files, error } = await supabase.storage
    .from("product_images")
    .list("");
  if (error) {
    console.error("Error listing storage files:", error);
    return;
  }
  const toDelete = files
    .filter((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return IMAGE_EXTS.includes(ext);
    })
    .map((f) => f.name);

  if (toDelete.length === 0) {
    console.log("No non-PNG images found in Supabase storage.");
    return;
  }

  console.log("Deleting non-PNG images from Supabase storage:");
  toDelete.forEach((f) => console.log(f));

  const { error: delError } = await supabase.storage
    .from("product_images")
    .remove(toDelete);
  if (delError) {
    console.error("Error deleting files:", delError);
  } else {
    console.log("Deleted all non-PNG images from Supabase storage.");
  }
}

removeNonPngFromSupabase();
