require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const db = require("./db");

db.query("SELECT 1", (err, results) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected successfully!");
  }
});

const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
