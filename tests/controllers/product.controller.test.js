const request = require("supertest");
const app = require("../../src/index"); // Seu app Express
const prisma = require("../setup");

describe("ProductController", () => {
  describe("POST /products", () => {
    it("should create a product", async () => {
      const categoria = await prisma.categorias.create({
        data: { nome: "Elétrica" },
      });
      const response = await request(app).post("/products").send({
        nome: "Cabo Elétrico",
        descricao: "Cabo de 2,5mm",
        preco: 29.9,
        marca: "Pirelli",
        imagem: "http://example.com/cabo.jpg",
        estoque: 100,
        categoria_id: categoria.id,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.nome).toBe("Cabo Elétrico");
      expect(response.body.preco).toBe("29.9"); // Prisma retorna DECIMAL como string
      expect(response.body.estoque).toBe(100);
    });

    it("should return 400 if creation fails", async () => {

      const categoria = await prisma.categorias.create({
        data: { nome: "Elétrica" },
      });
      const response = await request(app).post("/products").send({
        descricao: "Cabo de 2,5mm",
        preco: 29.9,
        categoria_id: categoria.id,
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("is missing."); // Mensagem de erro genérica
    });
  });

  describe("GET /products", () => {
    it("should get all products", async () => {
      const categoria = await prisma.categorias.create({
        data: { nome: "Elétrica" },
      });

      await prisma.produtos.create({
        data: {
          nome: "Cabo Elétrico",
          descricao: "Cabo de 2,5mm",
          preco: 29.9,
          marca: "Pirelli",
          imagem: "http://example.com/cabo.jpg",
          estoque: 100,
          categoria_id: categoria.id,
        },
      });

      const response = await request(app).get("/products");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe("Cabo Elétrico");
    });

    it("should return empty array if no products exist", async () => {
      const response = await request(app).get("/products");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /products/:id", () => {
    it("should get a product by id", async () => {
      const categoria = await prisma.categorias.create({
        data: { nome: "Elétrica" },
      });

      const product = await prisma.produtos.create({
        data: {
          nome: "Cabo Elétrico",
          descricao: "Cabo de 2,5mm",
          preco: 29.9,
          marca: "Pirelli",
          imagem: "http://example.com/cabo.jpg",
          estoque: 100,
          categoria_id: categoria.id,
        },
      });

      const response = await request(app).get(`/products/${product.id}`);
      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Cabo Elétrico");
    });

    it("should return 404 if product not found", async () => {
      const response = await request(app).get("/products/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Produto não encontrado");
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product", async () => {
      const categoria = await prisma.categorias.create({
        data: { nome: "Elétrica" },
      });

      const product = await prisma.produtos.create({
        data: {
          nome: "Cabo Elétrico",
          descricao: "Cabo de 2,5mm",
          preco: 29.9,
          marca: "Pirelli",
          imagem: "http://example.com/cabo.jpg",
          estoque: 100,
          categoria_id: categoria.id,
        },
      });

      const response = await request(app).put(`/products/${product.id}`).send({
        nome: "Cabo Elétrico 4mm",
        descricao: "Cabo de 4mm",
        preco: 39.9,
        marca: "Pirelli",
        imagem: "http://example.com/cabo4mm.jpg",
        estoque: 50,
        categoria_id: categoria.id,
      });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Cabo Elétrico 4mm");
      expect(response.body.preco).toBe("39.9");
      expect(response.body.estoque).toBe(50);
    });

    it("should return 404 if product not found", async () => {
      const response = await request(app).put("/products/999").send({
        nome: "Cabo Elétrico 4mm",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Produto não encontrado");
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product", async () => {
      const categoria = await prisma.categorias.create({
        data: { nome: "Elétrica" },
      });

      const product = await prisma.produtos.create({
        data: {
          nome: "Cabo Elétrico",
          descricao: "Cabo de 2,5mm",
          preco: 29.9,
          marca: "Pirelli",
          imagem: "http://example.com/cabo.jpg",
          estoque: 100,
          categoria_id: categoria.id,
        },
      });

      const response = await request(app).delete(`/products/${product.id}`);
      expect(response.status).toBe(204);
    });

    it("should return 404 if product not found", async () => {
      const response = await request(app).delete("/products/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Produto não encontrado");
    });
  });
});
