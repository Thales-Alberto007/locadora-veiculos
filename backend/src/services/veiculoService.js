const prisma = require('../prisma');
const criarErro = require('../utils/criarErro');

async function cadastrar({ marca, modelo, placa, ano, valorDiaria }) {
  if (!marca || !modelo || !placa || ano === undefined || valorDiaria === undefined) {
    throw criarErro('Marca, modelo, placa, ano e valor da diária são obrigatórios', 400);
  }

  const anoNumero = Number(ano);

  if (!Number.isInteger(anoNumero)) {
    throw criarErro('O ano deve ser um número inteiro', 400);
  }

  const valor = Number(valorDiaria);

  if (!Number.isFinite(valor) || valor <= 0) {
    throw criarErro('O valor da diária deve ser maior que zero', 400);
  }

  const placaNormalizada = String(placa).trim().toUpperCase();

  const existente = await prisma.veiculo.findUnique({
    where: { placa: placaNormalizada }
  });

  if (existente) {
    throw criarErro('Placa já cadastrada', 409);
  }

  try {
    return await prisma.veiculo.create({
      data: {
        marca: String(marca).trim(),
        modelo: String(modelo).trim(),
        placa: placaNormalizada,
        ano: anoNumero,
        valorDiaria: valor,
        disponivel: true,
      },
    });
  } catch (erro) {
    if (erro.code === 'P2002') {
      throw criarErro('Placa já cadastrada', 409);
    }

    throw erro;
  }
}

function listar(apenasDisponiveis) {
  const where = apenasDisponiveis ? { disponivel: true } : {};

  return prisma.veiculo.findMany({
    where,
    orderBy: { id: 'asc' }
  });
}

module.exports = { cadastrar, listar };