import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { user_id, oldPassword, newPassword, confirmPassword } = req.body;

    if (!user_id) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all the fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "The passwords do not match",
      });
    }

    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
      user_id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Failed to find user" });
    }

    const [existingPassword] = await db.query(
      "SELECT id FROM users WHERE password = ?",
      [newPassword]
    );

    if (existingPassword > 0) {
      return res.status(400).json({
        message: "New password can not be the same as the old password",
      });
    }

    const ok = await bcrypt.compare(oldPassword, rows[0].password);

    if (!ok) {
      return res.status(401).json({
        message:
          "The password you have entered does not match the old password",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      user_id,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
