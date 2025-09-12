const prisma = require("../prisma/client");

class ProductService {
  static async createProduct(data) {
    console.log("createProduct service");
    const { nome, descricao, preco, marca, imagem, estoque, categoria_id } =
      data;
    return await prisma.produtos.create({
      data: {
        nome,
        descricao,
        preco,
        marca,
        imagem,
        estoque,
        categoria_id,
      },
    });
  }

  static async getAllProducts() {
    return prisma.produtos.findMany({
      include: {
        categorias: true,
      },
    });
  }

  static async getProductById(id) {
    let product = await prisma.produtos.findUnique({
      where: { id },
      include: {
        categorias: true,
        variacoes_produto: true,
        subcategorias: true,
      },
    });
    product = {...product, subcategoria: product.subcategorias, variacoes: product.variacoes_produto};
    delete product.subcategorias;
    delete product.variacoes_produto;
    return product;
  }

  static async getProductByCategory(categoria_id) {
    const data =  await prisma.produtos.findMany({
      where: { categoria_id }
    });
    return data;
  };

  static async updateProduct(id, data) {
    console.log('id: ', id)
    const { nome, descricao, preco, marca, imagem, estoque, categoria_id } =
      data;
      console.log({ 
        nome,
        descricao,
        preco,
        marca,
        imagem,
        estoque,
        categoria_id
      })
    try {
      const product = await prisma.produtos.update({
        where: { id },
        data: {
          nome,
          descricao,
          preco,
          marca,
          imagem,
          estoque,
          categoria_id,
        },
      });
      return product;
    } catch (e) {
      console.log('erro no update: ', e)
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
