
const express = require("express");
const authRoutes = require("./authRoutes");
const autenticar = require("../middlewares/autenticar");
const veiculoRoutes = require("./veiculoRoutes");
const locacaoRoutes = require("./locacaoRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mensagem: "API da locadora funcionando" });
});

router.use("/auth", authRoutes);
router.use("/veiculos", veiculoRoutes);
router.use("/locacoes", locacaoRoutes);

router.get("/teste-protegida", autenticar, (req, res) => {
  res.json({
    mensagem: "Acesso autorizado",
    usuarioId: req.usuarioId
  });
});

module.exports = router;
