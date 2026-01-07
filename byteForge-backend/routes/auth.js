import express from "express";
import supabase from "../supabase.js";
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

    // Check if user already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashed, name }])
      .select();

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({ message: "Failed to register user" });
    }

    const user = data[0];
    res.status(201).json({
      message: "Registered",
      user: { id: user.id, email: user.email, name: user.name },
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

    // Get user by email
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || !users || users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

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
