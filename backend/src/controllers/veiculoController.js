const veiculoService = require('../services/veiculoService');

async function cadastrar(req, res, next) {
  try {
    const veiculo = await veiculoService.cadastrar(req.body);
    res.status(201).json(veiculo);
  } catch (erro) {
    next(erro);
  }
}

async function listar(req, res, next) {
  try {
    const apenasDisponiveis = req.query.disponivel === 'true';
    const veiculos = await veiculoService.listar(apenasDisponiveis);
    res.json(veiculos);
  } catch (erro) {
    next(erro);
  }
}

module.exports = { cadastrar, listar };
