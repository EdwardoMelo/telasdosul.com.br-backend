const prisma = require('../prisma/client');

class SubCategoryService {
  //createManyByCategoryId
  static async createManyByCategoryId(categoria_id, subcategorias) {
      if(!categoria_id || !categoria_id > 0){ 
        throw new Error('Categoria inválida');
      }
      return await prisma.subcategorias.createMany({
         data : subcategorias.map(subcategoria => ({
            nome: subcategoria.nome,
            categoria_id: categoria_id,
            descricao: subcategoria.descricao,
         }))
      })
  } 

  static async getAll() {
    return await prisma.subcategorias.findMany();
  }

  static async getById(id) {
    return await prisma.subcategorias.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  static async create(data) {
    const { nome, categoria_id } = data;
    return await prisma.subcategorias.create({
      data: { nome, categoria_id },
    });
  }

  static async update(id, data) {
    const { nome, categoria_id } = data;
    return await prisma.subcategorias.update({
      where: { id: parseInt(id, 10) },
      data: { nome, categoria_id },
    });
  }

  static async delete(id) {
    return await prisma.subcategorias.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}

module.exports = SubCategoryService;
