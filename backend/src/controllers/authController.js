
const authService = require("../services/authService");

const cadastrar = async (req, res) => {
    const usuario = await authService.cadastrar(req.body);

    return res.status(201).json(usuario);
};

const login = async (req, res) => {
    const resultado = await authService.login(req.body);

    return res.status(200).json(resultado);
};

module.exports = {
    cadastrar,
    login
};
