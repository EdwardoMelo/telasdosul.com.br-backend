const variationService = require('../services/variationService')

class VariationController {
    static async getAll(req, res) {
        try {
            const variacoes = await variationService.getAll();
            res.status(200).json(variacoes);
        } catch (error) {
            res.status(500).json({ message: error.message || "Erro ao buscar variações" });
        }
    }

    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const variacao = await variationService.getById(id);
            if (!variacao) {
                res.status(404).json({ message: "Variação não encontrada" });
                return;
            }
            res.status(200).json(variacao);
        } catch (error) {
            res.status(500).json({ message: error.message || "Erro ao buscar variação" });
        }
    }

    static async getByProdutoId(req, res) {
        try {
            const produtoId = parseInt(req.params.produto_id);
            if (isNaN(produtoId)) {
                res.status(400).json({ message: "ID do produto inválido" });
                return;
            }
            const variacoes = await variationService.getByProdutoId(produtoId);
            res.status(200).json(variacoes);
        } catch (error) {
            res.status(500).json({ message: error.message || "Erro ao buscar variações do produto" });
        }
    }

    static async create(req, res) {
        try {
            const data = req.body;
            if (!data.nome  || !data.produto_id) {
                res.status(400).json({ message: "Nome, descrição e produto_id são obrigatórios" });
                return;
            }
            const variacao = await variationService.create(data);
            res.status(201).json(variacao);
        } catch (error) {
            console.log('Error ao criar variação: ', error.message)
            res.status(500).json({ message: error.message || "Erro ao criar variação" });
        }
    }

    static async createManyByProductId(req, res) {
        try {
            const produtoId = parseInt(req.params.produto_id);
            const variacoes = req.body;
            if (isNaN(produtoId)) {
                res.status(400).json({ message: "ID do produto inválido" });
                return;
            }
            if (!Array.isArray(variacoes) || variacoes.length === 0) {
                res.status(400).json({ message: "É necessário fornecer uma lista de variações" });
                return;
            }
            const createdVariacoes = await variationService.createManyByProductId(produtoId, variacoes);
            res.status(201).json(createdVariacoes);
        } catch (error) {
            console.log('Error ao criar variações: ', error.message)
            res.status(500).json({ message: error.message || "Erro ao criar variações" });
        }
    }

    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            if (!data.nome || !data.descricao || !data.produto_id) {
                res.status(400).json({ message: "Nome, descrição e produto_id são obrigatórios" });
                return;
            }
            const variacao = await variationService.update(id, data);
            if (!variacao) {
                res.status(404).json({ message: "Variação não encontrada" });
                return;
            }
            res.status(200).json(variacao);
        } catch (error) {
            res.status(500).json({ message: error.message || "Erro ao atualizar variação" });
        }
    }

    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const deleted = await variationService.delete(id);
            if (!deleted) {
                res.status(404).json({ message: "Variação não encontrada" });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message || "Erro ao excluir variação" });
        }
    }
}

module.exports = VariationController;