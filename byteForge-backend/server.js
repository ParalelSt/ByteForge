import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import db from "./db.js";
import productsRoute from "./routes/products.js";
import productUpload from "./routes/uploadProducts.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.105:5173",
      "http://192.168.1.105",
    ],
  })
);
app.use(express.json());
app.use("/images", express.static("images/product_images"));

// Routes
app.use("/products", productsRoute);
app.use("/", productUpload);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// DB connection test
db.query("SELECT 1")
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000");
});
