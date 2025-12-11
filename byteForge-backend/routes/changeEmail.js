import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { user_id, newUsername, currentUsername, currentPassword } = req.body;

    // Single validation check
    if (!user_id || !currentUsername || !newUsername || !currentPassword) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Get current user data
    const [rows] = await db.query(
      "SELECT name, password FROM users WHERE id = ?",
      [user_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (rows[0].name !== currentUsername) {
      return res
        .status(400)
        .json({ message: "Current username doesn't match" });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (newUsername === currentUsername) {
      return res
        .status(400)
        .json({ message: "New username must be different" });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE name = ?", [
      newUsername,
    ]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "Username already in use" });
    }

    await db.query("UPDATE users SET name = ? WHERE id = ?", [
      newUsername,
      user_id,
    ]);

    return res.status(200).json({ message: "Username changed successfully" });
  } catch (error) {
    console.error("Change username error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
