function tratarErros(erro, req, res, next) {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido" });
  }

  if (erro.code === "P2002") {
    return res.status(409).json({ erro: "Já existe um cadastro com esses dados" });
  }

  if (erro.status) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  console.log(erro);
  return res.status(500).json({ erro: "Erro interno no servidor" });
}

module.exports = tratarErros;
