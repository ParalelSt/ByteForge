import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

//Register route

router.post("/register", async (req, res) => {
  try {
    const { email, password, name = "" } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const [existing] = await db.query("SELECT id FROM users where email = ?", [
      email,
    ]);
    if (existing.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashed, name]
    );

    res.status(201).json({
      message: "Registered",
      user: { id: result.insertId, email, name },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Login route

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Never return password
    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name ?? "" },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
