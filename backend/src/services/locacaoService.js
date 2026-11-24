
const prisma = require('../prisma');
const criarErro = require('../utils/criarErro');

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function converterId(valor, nomeCampo) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(`${nomeCampo} inválido`, 400);
  }

  return id;
}

async function registrar(usuarioId, { veiculoId, dataInicio, dataPrevistaDevolucao }) {
  if (!veiculoId || !dataInicio || !dataPrevistaDevolucao) {
    throw criarErro('Veículo, data de início e data prevista de devolução são obrigatórios', 400);
  }

  const idVeiculo = converterId(veiculoId, 'Veículo');
  const inicio = new Date(dataInicio);
  const fim = new Date(dataPrevistaDevolucao);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    throw criarErro('Datas inválidas', 400);
  }

  if (fim <= inicio) {
    throw criarErro('A data prevista de devolução deve ser posterior à data de início', 400);
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  });

  if (!usuario) {
    throw criarErro('Usuário não encontrado', 401);
  }

  return prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({
      where: { id: idVeiculo }
    });

    if (!veiculo) {
      throw criarErro('Veículo não encontrado', 404);
    }

    const reservado = await tx.veiculo.updateMany({
      where: {
        id: idVeiculo,
        disponivel: true
      },
      data: {
        disponivel: false
      },
    });

    if (reservado.count === 0) {
      throw criarErro('Veículo indisponível para locação', 409);
    }

    const diarias = Math.ceil(
      (fim.getTime() - inicio.getTime()) / MS_POR_DIA
    );

    const valorTotal = veiculo.valorDiaria.mul(diarias);

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId: idVeiculo,
        dataInicio: inicio,
        dataPrevistaDevolucao: fim,
        valorTotal,
        status: 'ATIVA',
      },
      include: { veiculo: true },
    });
  });
}

function listar(usuarioId) {
  return prisma.locacao.findMany({
    where: { usuarioId },
    include: { veiculo: true },
    orderBy: { dataInicio: 'desc' },
  });
}

async function finalizar(usuarioId, idParametro) {
  const id = converterId(idParametro, 'Locação');

  return prisma.$transaction(async (tx) => {
    const locacao = await tx.locacao.findUnique({
      where: { id }
    });

    if (!locacao) {
      throw criarErro('Locação não encontrada', 404);
    }

    if (locacao.usuarioId !== usuarioId) {
      throw criarErro('Você não tem permissão para finalizar esta locação', 403);
    }

    const encerrada = await tx.locacao.updateMany({
      where: {
        id,
        status: 'ATIVA'
      },
      data: {
        status: 'FINALIZADA',
        dataDevolucao: new Date()
      },
    });

    if (encerrada.count === 0) {
      throw criarErro('Locação já finalizada', 409);
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { disponivel: true },
    });

    return tx.locacao.findUnique({
      where: { id },
      include: { veiculo: true }
    });
  });
}

module.exports = { registrar, listar, finalizar };
