
const locacaoService = require('../services/locacaoService');

async function registrar(req, res, next) {
  try {
    const locacao = await locacaoService.registrar(req.usuarioId, req.body);
    res.status(201).json(locacao);
  } catch (erro) {
    next(erro);
  }
}

async function listar(req, res, next) {
  try {
    const locacoes = await locacaoService.listar(req.usuarioId);
    res.json(locacoes);
  } catch (erro) {
    next(erro);
  }
}

async function finalizar(req, res, next) {
  try {
    const locacao = await locacaoService.finalizar(req.usuarioId, req.params.id);
    res.json(locacao);
  } catch (erro) {
    next(erro);
  }
}

module.exports = { registrar, listar, finalizar };
