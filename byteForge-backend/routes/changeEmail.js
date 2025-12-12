import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { user_id, currentEmail, newEmail, currentPassword } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Failed to fetch user",
      });
    }

    if (!currentEmail || !newEmail || !currentPassword) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const [rows] = await db.query(
      "SELECT email, password FROM users WHERE id = ?",
      [user_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (rows[0].email !== currentEmail) {
      return res.status(400).json({
        message: "Current email does not match the old email",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (newEmail === currentEmail) {
      return res.status(400).json({
        message: "New Email cannot be the same as the old email",
      });
    }

    const [existingEmail] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [newEmail]
    );

    if (existingEmail > 0) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    await db.query("UPDATE users SET email = ? WHERE id = ?", [
      newEmail,
      user_id,
    ]);

    res.json({
      message: "Email changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
