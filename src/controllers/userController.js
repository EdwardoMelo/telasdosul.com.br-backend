const userService = require("../services/userService");
 
class UserController {

  static async sendPasswordResetEmail(req, res){ 
    try {
      const { email } = req.body;
      const response = await userService.sendPasswordResetEmail(email);
      return res.status(200).json(response);
    }catch(e){ 
      res.status(500).json({ error: e.message });
    }
  }

  static async signUp(req, res) {
    try {
      await UserController.createUser(req, res);
    } catch (e) {
      console.log('Erro no signUp: ', e.message)
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      const login = await userService.login(email, senha);
      const { token, usuario } = login;
      if (!token || !usuario) {
         return res.status(401).json({ error: "Credenciais inválidas" });
      }
      res.json({ token, usuario });
    } catch (error) {
      console.log('Erro ao fazer login: ', error.message)
      res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { nome, email, senha, tipo_usuario_id } = req.body;
      const user = await userService.createUser({
        nome,
        email,
        senha,
        tipo_usuario_id,
      });
      res.status(201).json(user);
    } catch (error) {
      console.log('Erro ao criar usuário: ', error.message)
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(Number(id));
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha, tipo_usuario_id } = req.body;
      const user = await userService.updateUser(Number(id), {
        nome,
        email,
        senha,
        tipo_usuario_id,
      });
      if (!user){ 
                return res
                  .status(404)
                  .json({ error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUser(Number(id));
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
