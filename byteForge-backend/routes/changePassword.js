import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { user_id, oldPassword, newPassword } = req.body;

    if (!user_id || !oldPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Failed to fetch user" });
    }

    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
      user_id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Failed to find user" });
    }

    const ok = await bcrypt.compare(oldPassword, rows[0].password);

    if (!ok) {
      return res.status(401).json({
        message:
          "The password that you have entered does not match the old password",
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
