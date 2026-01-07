import express from "express";
import supabase from "../supabase.js";
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

    // Get user by id
    const { data: users, error: getUserError } = await supabase
      .from("users")
      .select("email, password")
      .eq("id", user_id)
      .limit(1);

    if (getUserError) throw getUserError;

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    if (user.email !== currentEmail) {
      return res.status(400).json({
        message: "Current email does not match the old email",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (newEmail === currentEmail) {
      return res.status(400).json({
        message: "New Email cannot be the same as the old email",
      });
    }

    // Check if new email already exists
    const { data: existingEmail, error: checkEmailError } = await supabase
      .from("users")
      .select("id")
      .eq("email", newEmail)
      .limit(1);

    if (checkEmailError) throw checkEmailError;

    if (existingEmail && existingEmail.length > 0) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    // Update email
    const { error: updateError } = await supabase
      .from("users")
      .update({ email: newEmail })
      .eq("id", user_id);

    if (updateError) throw updateError;

    res.json({
      message: "Email changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
