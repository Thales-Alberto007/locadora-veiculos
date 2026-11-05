const jwt = require("jsonwebtoken");

const autenticar = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      erro: "Token não informado"
    });
  }

  const partes = authorization.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      erro: "Token inválido"
    });
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuarioId = payload.usuarioId;

    next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Token inválido ou expirado"
    });
  }
};

module.exports = autenticar;