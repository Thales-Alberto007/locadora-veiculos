const authService = require("../services/authService");

const cadastrar = async (req, res, next) => {
    try {
        const usuario = await authService.cadastrar(req.body);

        return res.status(201).json(usuario);
    } catch (erro) {
        next(erro);
    }
};

const login = async (req, res, next) => {
    try {
        const resultado = await authService.login(req.body);

        return res.status(200).json(resultado);
    } catch (erro) {
        next(erro);
    }
};

module.exports = {
    cadastrar,
    login
};