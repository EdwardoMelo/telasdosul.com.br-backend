const userTypeService = require('../services/userTypeService');

class UserTypeController {
    async getAll(req, res) {
        console.log("get all user types")
        try {
            const userTypes = await userTypeService.getAll();
            res.json(userTypes);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getById(req, res) {
        try {
            const userType = await userTypeService.getById(req.params.id);
            if (!userType) {
                return res.status(404).json({ message: 'Tipo de usuário não encontrado' });
            }
            res.json(userType);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async create(req, res) {
        try {
            const { tipo } = req.body;
            if (!tipo) {
                return res.status(400).json({ message: "O campo 'tipo' é obrigatório" });
            }
            const newUserType = await userTypeService.create(tipo);
            res.status(201).json(newUserType);
        } catch (error) {
            if (error.message.includes("obrigatório") || error.message.includes("não vazia")) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async update(req, res) {
        try {
            const { tipo, permissoes } = req.body;
            const updatedUserType = await userTypeService.update(req.params.id, { tipo, permissoes });
            if (!updatedUserType) {
                return res.status(404).json({ message: 'Tipo de usuário não encontrado para atualização' });
            }
            res.json(updatedUserType);
        } catch (error) {
            if (error.message.includes("não vazia")) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async delete(req, res) {
        try {
            const success = await userTypeService.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Tipo de usuário não encontrado para exclusão' });
            }
            res.status(204).send(); // No content
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

module.exports = new UserTypeController();
