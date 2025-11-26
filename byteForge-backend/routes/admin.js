import express from "express";

const router = express.Router();

router.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password required" });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, message: "Invalid password" });
});

export default router;
