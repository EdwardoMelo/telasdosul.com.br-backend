const prisma = require("../prisma/client");

class VariationService {
  static async create(data) {
    console.log('variationService.create')
    VariationService.validateVariacao(data);
    return await prisma.variacoes_produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        produto_id: data.produto_id,
      },
    });
  }

  static async createManyByProductId(produto_id, variacoes) {
    if (!produto_id || produto_id <= 0) {
      throw new Error("ID do produto inválido");
    }
    variacoes.forEach((v) =>
      VariationService.validateVariacao({ ...v, produto_id })
    );
    return await prisma.variacoes_produto.createMany({
      data: variacoes.map((v) => ({
        nome: v.nome,
        descricao: v.descricao,
        produto_id,
      })),
    });
  }

  static async getById(id) {
    if (!id || id <= 0) {
      throw new Error("ID inválido");
    }
    return await prisma.variacoes_produto.findUnique({
      where: { id },
    });
  }

  static async getByProdutoId(produto_id) {
    if (!produto_id || produto_id <= 0) {
      throw new Error("ID do produto inválido");
    }
    return await prisma.variacoes_produto.findMany({
      where: { produto_id },
    });
  }

  static async getAll() {
    return await prisma.variacoes_produto.findMany();
  }

  static async update(id, data) {
    if (!id || id <= 0) {
      throw new Error("ID inválido");
    }
    VariationService.validateVariacao(data);
    return await prisma.variacoes_produto.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        produto_id: data.produto_id,
        updated_at: new Date(),
      },
    });
  }

  static async delete(id) {
    if (!id || id <= 0) {
      throw new Error("ID inválido");
    }
    return await prisma.variacoes_produto.delete({
      where: { id },
    });
  }

  static validateVariacao(data) {
    if (!data.nome || data.nome.trim() === "") {
      throw new Error("O nome da variação é obrigatório");
    }
    if (!data.produto_id || data.produto_id <= 0) {
      throw new Error("O ID do produto é obrigatório e deve ser válido");
    }
  }
}

module.exports = VariationService;
