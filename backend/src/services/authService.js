const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const criarErro = require("../utils/criarErro");

const cadastrar = async ({ nome, email, senha }) => {
    if (!nome || !email || !senha) {
        throw criarErro("Nome, email e senha são obrigatórios", 400);
    }

    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
    });

    if (usuarioExistente) {
        throw criarErro("Email já cadastrado", 409);
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash
        },
        select: {
            id: true,
            nome: true,
            email: true,
            criadoEm: true
        }
    });

    return usuario;
};

const login = async ({ email, senha }) => {
    if (!email || !senha) {
        throw criarErro("Email e senha são obrigatórios", 400);
    }

    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!usuario) {
        throw criarErro("Email ou senha inválidos", 401);
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        throw criarErro("Email ou senha inválidos", 401);
    }

    const token = jwt.sign(
        { usuarioId: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token
    };
};

module.exports = {
    cadastrar,
    login
};
