import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, messageContent } = req.body;

    if (!name || !email || !subject || !messageContent) {
      return res.status(400).json({
        message: "Please fill in all the fields",
      });
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert([{ name, email, subject, message: messageContent }]);

    if (error) throw error;

    res.json({
      message:
        "Your message has been sent successfully. Our team will get back to you as soon as possible.",
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Server error.",
    });
  }
});

export default router;
