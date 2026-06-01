const prisma = require("../prisma/client");

class PriceLineRepository {
  static async findById(id) {
    return prisma.linhas_preco_produto.findUnique({ where: { id } });
  }

  static async findByProductId(produto_id, { apenasAtivas = false } = {}) {
    return prisma.linhas_preco_produto.findMany({
      where: {
        produto_id,
        ...(apenasAtivas ? { ativo: true } : {}),
      },
      orderBy: [{ ordem: "asc" }, { valor: "asc" }],
    });
  }

  static async create(data) {
    return prisma.linhas_preco_produto.create({ data });
  }

  static async createMany(data) {
    return prisma.linhas_preco_produto.createMany({ data });
  }

  static async update(id, data) {
    return prisma.linhas_preco_produto.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  }

  static async delete(id) {
    return prisma.linhas_preco_produto.delete({ where: { id } });
  }

  static async deleteByProductId(produto_id) {
    return prisma.linhas_preco_produto.deleteMany({ where: { produto_id } });
  }

  static async replaceAllByProductId(produto_id, linhas) {
    return prisma.$transaction(async (tx) => {
      await tx.linhas_preco_produto.deleteMany({ where: { produto_id } });

      if (!linhas.length) {
        return [];
      }

      await tx.linhas_preco_produto.createMany({
        data: linhas.map((linha) => ({
          produto_id,
          valor: linha.valor,
          preco: linha.preco,
          rotulo: linha.rotulo ?? null,
          ordem: linha.ordem ?? 0,
          ativo: linha.ativo ?? true,
        })),
      });

      return tx.linhas_preco_produto.findMany({
        where: { produto_id },
        orderBy: [{ ordem: "asc" }, { valor: "asc" }],
      });
    });
  }
}

module.exports = PriceLineRepository;
