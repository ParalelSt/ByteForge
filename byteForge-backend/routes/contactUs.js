import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, messageContent } = req.body;

    if (!name || !email || !subject || !messageContent) {
      return res.status(400).json({
        message: "Please fill in all the fields",
      });
    }

    await db.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, messageContent]
    );

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
