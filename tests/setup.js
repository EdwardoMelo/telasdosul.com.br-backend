const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

// Carrega variáveis de ambiente específicas para testes
dotenv.config({ path: ".env.test" });

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.usuarios.deleteMany();
  await prisma.tipos_usuarios.deleteMany();
  await prisma.produtos.deleteMany();
  await prisma.categorias.deleteMany();
  // Adicione outras tabelas se necessário
});

// Após todos os testes, desconecta
afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
