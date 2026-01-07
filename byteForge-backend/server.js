import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import supabase from "./supabase.js";
import productsRoute from "./routes/products.js";
import productUpload from "./routes/uploadProducts.js";
import adminRoutes from "./routes/admin.js";
import adminProducts from "./routes/adminProducts.js";
import promosRoute from "./routes/promos.js";
import adminPromosRoute from "./routes/adminPromos.js";
import authRoutes from "./routes/auth.js";
import ordersRoute from "./routes/orders.js";
import changePasswordRoute from "./routes/changePassword.js";
import changeEmailRoute from "./routes/changeEmail.js";
import changeUsernameRoute from "./routes/changeUsername.js";
import contactUsRoute from "./routes/contactUs.js";
import cartRoute from "./routes/cart.js";
import productRoute from "./routes/fetchProduct.js";
import productRecommendations from "./routes/fetchRecommendations.js";
import discountsRoute from "./routes/discounts.js";
import reviewsRoute from "./routes/reviews.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://192.168.1.105:5173",
      "http://192.168.1.105:5174",
      "http://192.168.1.105",
      "http://192.168.1.105:3000",
      "https://byte-forge-9hno.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-password"],
  })
);

app.use(express.json());

app.use(
  "/images/product_images",
  (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "images/product_images"))
);

app.use(
  "/images/promo_images",
  (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "images/promo_images"))
);

// Routes
console.log("Registering /products route");
app.use("/products", productsRoute);
console.log("Registering /discounts route");
app.use("/discounts", discountsRoute);
console.log("Registering /upload route");
app.use("/upload", productUpload);
console.log("Registering /admin route");
app.use("/admin", adminRoutes);
console.log("Registering /admin/products route");
app.use("/admin/products", adminProducts);
console.log("Registering /admin/discounts route");
app.use("/admin/discounts", discountsRoute);
console.log("Registering /promos route");
app.use("/promos", promosRoute);
console.log("Registering /admin/promos route");
app.use("/admin/promos", adminPromosRoute);
console.log("Registering /auth route");
app.use("/auth", authRoutes);
console.log("Registering /orders route");
app.use("/orders", ordersRoute);
console.log("Registering /auth/change-password");
app.use("/auth/change-password", changePasswordRoute);
console.log("Registering /auth/change-email");
app.use("/auth/change-email", changeEmailRoute);
console.log("Registering /auth/change-username");
app.use("/auth/change-username", changeUsernameRoute);
console.log("Registering /auth/contact");
app.use("/contact", contactUsRoute);
console.log("Registering /cart route");
app.use("/cart", cartRoute);
console.log("Registering /reviews route");
app.use("/", reviewsRoute);
console.log("Registering product detail route");
app.use("/products", productRoute);
console.log("Registering product recommendations route");
app.use("/products", productRecommendations);

// Supabase connection test
supabase
  .from("products")
  .select()
  .limit(1)
  .then(() => console.log("✅ Supabase connected successfully!"))
  .catch((err) => console.error("❌ Supabase connection failed:", err));

// Global error handler (always returns JSON)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// Export for Vercel
export default app;

// Start server locally (for development)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
