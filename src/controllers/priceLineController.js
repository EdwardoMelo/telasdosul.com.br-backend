const PriceLineService = require("../services/priceLineService");

class PriceLineController {
  static async replaceByProductId(req, res) {
    try {
      const { produto_id } = req.params;
      const { linhas } = req.body;
      const result = await PriceLineService.replaceAllByProductId(
        Number(produto_id),
        linhas ?? []
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByProductId(req, res) {
    try {
      const { produto_id } = req.params;
      const linhas = await PriceLineService.getByProductId(Number(produto_id), {
        ativo: true,
      });
      res.json(linhas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PriceLineController;
