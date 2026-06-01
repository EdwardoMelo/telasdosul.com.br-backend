const prisma = require("../prisma/client");
const PriceLineService = require("./priceLineService");

class ProductService {
  static mapProductResponse(product) {
    if (!product) return product;

    const {
      subcategorias,
      variacoes_produto,
      linhas_preco_produto,
      ...rest
    } = product;

    const linhasPreco = PriceLineService.formatLinesForResponse(
      linhas_preco_produto ?? [],
      rest
    );

    return {
      ...rest,
      subcategoria: subcategorias ?? null,
      variacoes: variacoes_produto ?? [],
      linhas_preco: linhasPreco,
      preco_exibicao: ProductService.resolveDisplayPrice(rest, linhasPreco),
    };
  }

  static resolveDisplayPrice(product, linhasPreco = []) {
    if (product.tipo_preco === "POR_METRICA" && linhasPreco.length > 0) {
      const precos = linhasPreco.map((linha) => Number(linha.preco));
      const min = Math.min(...precos);
      const max = Math.max(...precos);

      return min === max
        ? { tipo: "faixa", valor: min }
        : { tipo: "faixa", min, max };
    }

    return product.preco != null
      ? { tipo: "fixo", valor: product.preco }
      : null;
  }

  static async createProduct(data) {
    const {
      nome,
      descricao,
      preco,
      tipo_preco = "FIXO",
      metrica,
      unidade_metrica,
      marca,
      imagem,
      estoque,
      categoria_id,
      subcategoria_id,
    } = data;

    PriceLineService.validatePricingConfig({
      tipo_preco,
      metrica,
      unidade_metrica,
    });

    return prisma.produtos.create({
      data: {
        nome,
        descricao,
        preco,
        tipo_preco,
        metrica,
        unidade_metrica,
        marca,
        imagem,
        estoque,
        categoria_id,
        subcategoria_id,
      },
    });
  }

  static async getAllProducts() {
    const products = await prisma.produtos.findMany({
      include: {
        categorias: true,
        linhas_preco_produto: {
          where: { ativo: true },
          orderBy: [{ ordem: "asc" }, { valor: "asc" }],
        },
      },
    });

    return products.map(ProductService.mapProductResponse);
  }

  static async getProductById(id) {
    const product = await prisma.produtos.findUnique({
      where: { id },
      include: {
        categorias: true,
        variacoes_produto: true,
        subcategorias: true,
        linhas_preco_produto: {
          where: { ativo: true },
          orderBy: [{ ordem: "asc" }, { valor: "asc" }],
        },
      },
    });

    return ProductService.mapProductResponse(product);
  }

  static async getProductByCategory(categoria_id) {
    const products = await prisma.produtos.findMany({
      where: { categoria_id },
      include: {
        linhas_preco_produto: {
          where: { ativo: true },
          orderBy: [{ ordem: "asc" }, { valor: "asc" }],
        },
      },
    });

    return products.map(ProductService.mapProductResponse);
  }

  static async updateProduct(id, data) {
    const {
      nome,
      descricao,
      preco,
      tipo_preco,
      metrica,
      unidade_metrica,
      marca,
      imagem,
      estoque,
      categoria_id,
      subcategoria_id,
    } = data;

    if (tipo_preco) {
      PriceLineService.validatePricingConfig({
        tipo_preco,
        metrica,
        unidade_metrica,
      });
    }

    try {
      const product = await prisma.produtos.update({
        where: { id },
        data: {
          nome,
          descricao,
          preco,
          tipo_preco,
          metrica,
          unidade_metrica,
          marca,
          imagem,
          estoque,
          categoria_id,
          subcategoria_id,
          updated_at: new Date(),
        },
        include: {
          linhas_preco_produto: {
            where: { ativo: true },
            orderBy: [{ ordem: "asc" }, { valor: "asc" }],
          },
        },
      });

      return ProductService.mapProductResponse(product);
    } catch (e) {
      console.log("erro no update: ", e);
      return null;
    }
  }

  static async deleteProduct(id) {
    try {
      const product = await prisma.produtos.delete({
        where: { id },
      });
      return product;
    } catch (e) {
      return null;
    }
  }
}

module.exports = ProductService;
