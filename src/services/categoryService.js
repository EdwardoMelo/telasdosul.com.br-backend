const prisma = require('../prisma/client');

class CategoryService {
    async createCategory(data) {
        return await prisma.categorias.create({ data });
    }

    async getCategoryById(id) {
        return await prisma.categorias.findUnique({ where: { id }, include: {subcategorias: true} });
    }

    async getAllCategories() {
        return await prisma.categorias.findMany({ 
            include:  {
                subcategorias: true
            }
        });
    }

    async updateCategory(id, data) {
        return await prisma.categorias.update({ where: { id }, data });
    }

    async deleteCategory(id) {
        return await prisma.categorias.delete({ where: { id } });
    }
}

module.exports = new CategoryService();