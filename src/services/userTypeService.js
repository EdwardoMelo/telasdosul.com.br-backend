const prisma = require("../prisma/client");

class UserTypeService {
  async getAll() {
    // Busca todos os tipos de usuários e suas permissões relacionadas
    return await prisma.tipos_usuarios.findMany({
      include: {
        permissoes_tipos_usuarios: true,
      },
    });
  }

  async getById(id) {
    // Busca um tipo de usuário pelo ID, incluindo permissões
    return await prisma.tipos_usuarios.findUnique({
      where: { id: parseInt(id) },
      include: {
        permissoes_tipos_usuarios: true,
      },
    });
  }
  async create(userTypeData) {
    if (!userTypeData.tipo) {
      throw new Error("O campo 'tipo' é obrigatório.");
    }
    return await prisma.tipos_usuarios.create({
      data: {
        tipo: userTypeData.tipo,
      },
      include: {
        permissoes_tipos_usuarios: true,
      },
    });
  }

  async update(id, userTypeData) {
    if (userTypeData.tipo !== undefined) {
      if (
        typeof userTypeData.tipo !== "string" ||
        userTypeData.tipo.trim() === ""
      ) {
        throw new Error(
          "O campo 'tipo' deve ser uma string não vazia se fornecido."
        );
      }
    }
    // Atualiza o tipo de usuário
    const updated = await prisma.tipos_usuarios.update({
      where: { id: parseInt(id) },
      data: {
        tipo: userTypeData.tipo,
      },
      include: {
        permissoes_tipos_usuarios: true,
      },
    });
    // Se quiser atualizar permissões, implemente lógica adicional aqui
    return updated;
  }

  async delete(id) {
    // Remove o tipo de usuário e suas permissões relacionadas (por cascade)
    await prisma.tipos_usuarios.delete({
      where: { id: parseInt(id) },
    });
    return true;
  }
}

module.exports = new UserTypeService();
