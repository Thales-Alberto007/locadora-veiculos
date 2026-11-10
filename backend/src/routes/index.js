const express = require("express");
const authRoutes = require("./authRoutes");
const autenticar = require("../middlewares/autenticar");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mensagem: "API da locadora funcionando" });
});

router.use("/auth", authRoutes);

router.get("/teste-protegida", autenticar, (req, res) => {
  res.json({
    mensagem: "Acesso autorizado",
    usuarioId: req.usuarioId
  });
});

module.exports = router;