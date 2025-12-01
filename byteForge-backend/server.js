import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";
import productsRoute from "./routes/products.js";
import productUpload from "./routes/uploadProducts.js";
import adminRoutes from "./routes/admin.js";
import adminProducts from "./routes/adminProducts.js";
import promosRoute from "./routes/promos.js";
import adminPromosRoute from "./routes/adminPromos.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
console.log("Starting backend server.js - THIS SHOULD PRINT");

// Minimal test and health routes
app.get("/test", (req, res) => {
  console.log("Received GET /test");
  res.json({ message: "Test route works!" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Root route to verify server instance
app.get("/", (req, res) => {
  res.json({ server: "byteForge-backend", status: "running" });
});

// Request logger to confirm incoming paths
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  next();
});
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Admin authentication middleware
function adminAuth(req, res, next) {
  const password = req.headers["x-admin-password"];

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
}

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://192.168.1.105:5173",
      "http://192.168.1.105",
      "http://192.168.1.105:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-password"],
  })
);

app.use(express.json());

// Static files with CORS headers
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
console.log("Registering /upload route");
app.use("/upload", productUpload);
console.log("Registering /admin route");
app.use("/admin", adminRoutes);
console.log("Registering /admin/products route");
app.use("/admin/products", adminProducts);
console.log("Registering /promos route");
app.use("/promos", promosRoute);
console.log("Registering /admin/promos route");
app.use("/admin/promos", adminPromosRoute);

// DB connection test
db.query("SELECT 1")
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Global error handler (always returns JSON)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// Start server
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000 (or your LAN IP)");
});
