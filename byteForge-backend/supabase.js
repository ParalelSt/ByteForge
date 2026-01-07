import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env file!");
  console.error("   Add these to your .env file:");
  console.error("   SUPABASE_URL=https://your-project.supabase.co");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
  process.exit(1);
}

// Create Supabase client with service role (for backend operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
