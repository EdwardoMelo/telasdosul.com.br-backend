const SubCategoryService = require("../services/subCategoryService");

class SubCategoryController {
  static async getAll(req, res) {
    try {
      const subCategories = await SubCategoryService.getAll();
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static createManyByCategoryId = async (req, res) => {
    try {
      const { categoria_id } = req.params;
      const { subcategorias } = req.body;
      const newSubCategories = await SubCategoryService.createManyByCategoryId(
        parseInt(categoria_id),
        subcategorias
      );
      console.log('newSubCategories', newSubCategories)
      res.status(201).json(newSubCategories);
    }
    catch (error) {
      console.log('erro ao criar categoria', error)
      res.status(500).json({ error: error.message });
    }
  };

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const subCategory = await SubCategoryService.getById(id);
      if (!subCategory) {
        return res.status(404).json({ error: "Subcategoria não encontrada" });
      }
      res.status(200).json(subCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nome, categoria_id } = req.body;
      const newSubCategory = await SubCategoryService.create({
        nome,
        categoria_id,
      });
      res.status(201).json(newSubCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, categoria_id } = req.body;
      const updatedSubCategory = await SubCategoryService.update(id, {
        nome,
        categoria_id,
      });
      res.status(200).json(updatedSubCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await SubCategoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SubCategoryController;
