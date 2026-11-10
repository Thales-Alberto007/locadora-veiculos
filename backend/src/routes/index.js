const express = require("express");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mensagem: "API da locadora funcionando" });
});

router.use("/auth", authRoutes);

module.exports = router;