const jwt = require("jsonwebtoken");
const criarErro = require("../utils/criarErro");

const autenticar = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw criarErro("Token não informado", 401);
  }

  const partes = authorization.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    throw criarErro("Token inválido", 401);
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuarioId = payload.usuarioId;

    next();
  } catch (erro) {
    throw criarErro("Token inválido ou expirado", 401);
  }
};

module.exports = autenticar;