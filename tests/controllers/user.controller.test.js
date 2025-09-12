const request = require("supertest");
const app = require("../../src/index"); // Seu app Express
const prisma = require("../setup");
const bcrypt = require("bcryptjs");

describe("UserController", () => {
  describe("POST /usuarios", () => {
    it("should create a user", async () => {
      // Cria um tipo de usuário antes do teste
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });
      console.log("tipoUsuario: ", tipoUsuario);

      const response = await request(app).post("/usuarios").send({
        nome: "João",
        email: "joao@example.com",
        senha: "123",
        tipo_usuario_id: tipoUsuario.id,
      });
      console.log("response.body: ", response.data);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.nome).toBe("João");
      expect(response.body.email).toBe("joao@example.com");
    });

    it("should return 500 if creation fails", async () => {
      // Cria um tipo de usuário e um usuário para testar violação de unicidade
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });
      await prisma.usuarios.create({
        data: {
          nome: "Maria",
          email: "maria@example.com",
          senha: "456",
          tipo_usuario_id: tipoUsuario.id,
        },
      });

      // Tenta criar outro usuário com o mesmo email
      const response = await request(app).post("/usuarios").send({
        nome: "João",
        email: "maria@example.com", // Email já existe
        senha: "123",
        tipo_usuario_id: tipoUsuario.id,
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Unique constraint failed");
    });
  });

  describe("GET /usuarios", () => {
    it("should get all usuarios", async () => {
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });

      await prisma.usuarios.create({
        data: {
          nome: "João",
          email: "joao@example.com",
          senha: "123",
          tipo_usuario_id: tipoUsuario.id,
        },
      });

      const response = await request(app).get("/usuarios");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe("João");
    });

    it("should return empty array if no usuarios exist", async () => {
      const response = await request(app).get("/usuarios");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /usuarios/:id", () => {
    it("should get a user by id", async () => {
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });

      const user = await prisma.usuarios.create({
        data: {
          nome: "João",
          email: "joao@example.com",
          senha: "123",
          tipo_usuario_id: tipoUsuario.id,
        },
      });

      const response = await request(app).get(`/usuarios/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("João");
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).get("/usuarios/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuário não encontrado");
    });
  });

  describe("PUT /usuarios/:id", () => {
    it("should update a user", async () => {
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });
      const user = await prisma.usuarios.create({
        data: {
          nome: "João",
          email: "joao@example.com",
          senha: "123",
          tipo_usuario_id: tipoUsuario.id,
        },
      });
      const response = await request(app).put(`/usuarios/${user.id}`).send({
        nome: "João Silva",
        email: "joao.silva@example.com",
        senha: "456",
        tipo_usuario_id: tipoUsuario.id,
      });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("João Silva");
      expect(response.body.email).toBe("joao.silva@example.com");
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).put("/usuarios/999").send({
        nome: "João Silva",
      });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuário não encontrado");
    });
  });

  describe("DELETE /usuarios/:id", () => {
    it("should delete a user", async () => {
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });
      const user = await prisma.usuarios.create({
        data: {
          nome: "João",
          email: "joao@example.com",
          senha: "123",
          tipo_usuario_id: tipoUsuario.id,
        },
      });

      const response = await request(app).delete(`/usuarios/${user.id}`);
      expect(response.status).toBe(204);
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).delete("/usuarios/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuário não encontrado");
    });
  });

  describe("POST /usuarios/signUp", () => {
    it("should sign up a new user", async () => {
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });

      const response = await request(app).post("/usuarios/signUp").send({
        nome: "Carlos",
        email: "carlos@example.com",
        senha: "password123",
        tipo_usuario_id: tipoUsuario.id,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.nome).toBe("Carlos");
      expect(response.body.email).toBe("carlos@example.com");
    });

    it("should return 500 if signup fails", async () => {
      const response = await request(app).post("/usuarios/signup").send({});
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /usuarios/login", () => {
    it("should log in a user and return a token", async () => {
      const tipoUsuario = await prisma.tipos_usuarios.create({
        data: { tipo: "cliente" },
      });

      const user = await prisma.usuarios.create({
        data: {
          nome: "Ana",
          email: "ana@example.com",
          senha: await bcrypt.hash("password123", 10),
          tipo_usuario_id: tipoUsuario.id,
        },
      });

      const response = await request(app).post("/usuarios/login").send({
        email: "ana@example.com",
        senha: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.usuario.nome).toBe("Ana");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/usuarios/login").send({
        email: "invalid@example.com",
        senha: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Credenciais inválidas");
    });

    it("should return 500 if login fails", async () => {
      const response = await request(app).post("/usuarios/login").send({});
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
