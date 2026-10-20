const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash("123456", 10);

  await prisma.usuario.upsert({
    where: { email: "ana@email.com" },
    update: {},
    create: { nome: "Ana Souza", email: "ana@email.com", senha: senha },
  });

  await prisma.usuario.upsert({
    where: { email: "bruno@email.com" },
    update: {},
    create: { nome: "Bruno Lima", email: "bruno@email.com", senha: senha },
  });

  const veiculos = [
    { marca: "Fiat", modelo: "Argo", placa: "ABC1D23", ano: 2022, valorDiaria: 120 },
    { marca: "Chevrolet", modelo: "Onix", placa: "DEF4G56", ano: 2023, valorDiaria: 135 },
    { marca: "Volkswagen", modelo: "T-Cross", placa: "HIJ7K89", ano: 2024, valorDiaria: 210 },
    { marca: "Toyota", modelo: "Corolla", placa: "LMN0P12", ano: 2021, valorDiaria: 250 },
  ];

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo,
    });
  }

  console.log("Dados de exemplo criados");
}

main()
  .catch((erro) => {
    console.log(erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
