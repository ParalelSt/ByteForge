import express from "express";
import supabase from "../supabase.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { user_id, newUsername, currentUsername, currentPassword } = req.body;

    if (!user_id) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUsername || !newUsername || !currentPassword) {
      return res.status(400).json({ message: "Please fill in all the fields" });
    }

    // Get user
    const { data: users, error: getUserError } = await supabase
      .from("users")
      .select("name, password")
      .eq("id", user_id)
      .limit(1);

    if (getUserError) throw getUserError;

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.name !== currentUsername) {
      return res
        .status(400)
        .json({ message: "Current username doesn't match" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (newUsername === currentUsername) {
      return res
        .status(400)
        .json({ message: "New username must be different" });
    }

    // Check if new username already exists
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("name", newUsername);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Update username
    const { error: updateError } = await supabase
      .from("users")
      .update({ name: newUsername })
      .eq("id", user_id);

    if (updateError) throw updateError;

    res.json({ message: "Username changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
