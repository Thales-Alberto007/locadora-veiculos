
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cadastrar = async ({ nome, email, senha }) => {
    if (!nome || !email || !senha) {
        const erro = new Error("Nome, email e senha são obrigatórios");
        erro.status = 400;
        throw erro;
    }

    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
    });

    if (usuarioExistente) {
        const erro = new Error("Email já cadastrado");
        erro.status = 409;
        throw erro;
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
        const erro = new Error("Email e senha são obrigatórios");
        erro.status = 400;
        throw erro;
    }

    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!usuario) {
        const erro = new Error("Email ou senha inválidos");
        erro.status = 401;
        throw erro;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        const erro = new Error("Email ou senha inválidos");
        erro.status = 401;
        throw erro;
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
