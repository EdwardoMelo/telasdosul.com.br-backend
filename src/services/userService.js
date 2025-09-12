const { createSendToken } = require('../auth/auth');
const prisma = require('../prisma/client');
const bcrypt = require("bcryptjs");
const emailService = require('../services/emailService');
class UserService {

  static async sendPasswordResetEmail(email) {
    try {
      const user = await prisma.usuarios.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      const {usuario, token} = createSendToken(user);
      await emailService.sendResetPasswordEmail(email, token, usuario.id);
      return { message: "Enviamos um link de recuperação de senha para o seu E-mail" };
    } catch (error) {
      console.error("Erro ao enviar email de recuperação de senha:", error);
      throw error;
    }
  }

  static async login(email, senha) {
    try {
      let user = await prisma.usuarios
        .findUnique({
          where: { email },
          include: {
            tipos_usuarios: {
              include: {
                permissoes_tipos_usuarios: true,
              },
            },
          },
        });
      user = {
        ...user,
        tipo_usuario: {...user.tipos_usuarios, permissoes: user.tipos_usuarios.permissoes_tipos_usuarios},
      };
      delete user.tipos_usuarios;
      if (!user) {
          return {usuario: null, token: null};
      }   
      const isPasswordCorrect = await bcrypt.compare(senha, user.senha);
      if (!isPasswordCorrect) {
        throw new Error("Senha incorreta");
      }
      return createSendToken(user);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error; // Ou retorne um objeto de erro padronizado
    }
  }

  static async createUser(data) {
    const { nome, email, senha, tipo_usuario_id } = data;
    const hashedPassword = await bcrypt.hash(senha, 10);
    return await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        tipo_usuario_id,
      },
    });
  }

  static async getAllUsers() {
    return await prisma.usuarios.findMany({
      include: {
        tipos_usuarios: true,
      },
    });
  }

  static async getUserById(id) {
    return await prisma.usuarios.findUnique({
      where: { id },
      include: {
        tipos_usuarios: true,
      },
    });
  }

  static async updateUser(id, data) {
    console.log("updateUser service");
    const { nome, email, senha, tipo_usuario_id } = data;
    const hashedPassword = await bcrypt.hash(senha, 10);

    try {
      const user = await prisma.usuarios.update({
        where: { id },
        data: {
          nome,
          email,
          senha: hashedPassword,
          tipo_usuario_id,
        },
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  static async deleteUser(id) {
    try {
      const user = await prisma.usuarios.delete({
        where: { id },
      });
      return user;
    } catch (e) {
      return null;
    }
  }
}

module.exports = UserService;