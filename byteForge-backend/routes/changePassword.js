import express from "express";
import supabase from "../supabase.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { user_id, oldPassword, newPassword, confirmPassword } = req.body;

    if (!user_id) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "The passwords do not match",
      });
    }

    // Get user
    const { data: users, error: getUserError } = await supabase
      .from("users")
      .select("password")
      .eq("id", user_id)
      .limit(1);

    if (getUserError) throw getUserError;

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Failed to find user" });
    }

    // Check if new password is the same as old password
    const ok = await bcrypt.compare(oldPassword, users[0].password);
    if (!ok) {
      return res.status(401).json({
        message:
          "The password you have entered does not match the old password",
      });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashed })
      .eq("id", user_id);

    if (updateError) throw updateError;

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
