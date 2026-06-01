const PriceLineRepository = require("../repositories/priceLineRepository");
const prisma = require("../prisma/client");

const METRICAS_VALIDAS = ["altura", "largura", "area", "comprimento", "peso"];

class PriceLineService {
  static async create(data) {
    await PriceLineService.ensureProductExists(data.produto_id);
    PriceLineService.validateLine(data);
    return PriceLineRepository.create(PriceLineService.toLineData(data));
  }

  static async createManyByProductId(produto_id, linhas) {
    await PriceLineService.ensureProductExists(produto_id);

    if (!Array.isArray(linhas) || linhas.length === 0) {
      throw new Error("Informe ao menos uma linha de preço");
    }

    linhas.forEach((linha) =>
      PriceLineService.validateLine({ ...linha, produto_id })
    );
    PriceLineService.ensureUniqueValues(linhas);

    return PriceLineRepository.createMany(
      linhas.map((linha, index) =>
        PriceLineService.toLineData({
          ...linha,
          produto_id,
          ordem: linha.ordem ?? index,
        })
      )
    );
  }

  static async replaceAllByProductId(produto_id, linhas) {
    await PriceLineService.ensureProductExists(produto_id);

    if (!Array.isArray(linhas)) {
      throw new Error("As linhas de preço devem ser enviadas em um array");
    }

    linhas.forEach((linha, index) =>
      PriceLineService.validateLine({
        ...linha,
        produto_id,
        ordem: linha.ordem ?? index,
      })
    );
    PriceLineService.ensureUniqueValues(linhas);

    return PriceLineRepository.replaceAllByProductId(
      produto_id,
      linhas.map((linha, index) =>
        PriceLineService.toLineData({
          ...linha,
          produto_id,
          ordem: linha.ordem ?? index,
        })
      )
    );
  }

  static async getById(id) {
    PriceLineService.validateId(id);
    return PriceLineRepository.findById(id);
  }

  static async getByProductId(produto_id, options = {}) {
    PriceLineService.validateId(produto_id, "ID do produto inválido");
    return PriceLineRepository.findByProductId(produto_id, options);
  }

  static async update(id, data) {
    PriceLineService.validateId(id);
    await PriceLineService.ensureProductExists(data.produto_id);
    PriceLineService.validateLine(data);

    return PriceLineRepository.update(id, PriceLineService.toLineData(data));
  }

  static async delete(id) {
    PriceLineService.validateId(id);
    return PriceLineRepository.delete(id);
  }

  static validatePricingConfig({ tipo_preco, metrica, unidade_metrica }) {
    if (tipo_preco === "POR_METRICA") {
      if (!metrica || !METRICAS_VALIDAS.includes(metrica)) {
        throw new Error(
          `Para preço por métrica, informe metrica válida: ${METRICAS_VALIDAS.join(", ")}`
        );
      }
      if (!unidade_metrica || unidade_metrica.trim() === "") {
        throw new Error("Para preço por métrica, informe a unidade (ex: m, cm, m2)");
      }
    }
  }

  static validateLine(data) {
    PriceLineService.validateId(data.produto_id, "ID do produto inválido");

    const valor = Number(data.valor);
    const preco = Number(data.preco);

    if (Number.isNaN(valor) || valor < 0) {
      throw new Error("O valor da métrica deve ser um número maior ou igual a zero");
    }

    if (Number.isNaN(preco) || preco < 0) {
      throw new Error("O preço da linha deve ser um número maior ou igual a zero");
    }
  }

  static ensureUniqueValues(linhas) {
    const valores = linhas.map((linha) => Number(linha.valor));
    const uniqueValues = new Set(valores);

    if (uniqueValues.size !== valores.length) {
      throw new Error("Não é permitido repetir o mesmo valor de métrica no produto");
    }
  }

  static async ensureProductExists(produto_id) {
    const product = await prisma.produtos.findUnique({
      where: { id: produto_id },
      select: { id: true },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }
  }

  static validateId(id, message = "ID inválido") {
    if (!id || Number(id) <= 0) {
      throw new Error(message);
    }
  }

  static toLineData(data) {
    return {
      produto_id: data.produto_id,
      valor: data.valor,
      preco: data.preco,
      rotulo: data.rotulo ?? null,
      ordem: data.ordem ?? 0,
      ativo: data.ativo ?? true,
    };
  }

  static formatLineForResponse(linha, produto) {
    if (!linha) return linha;

    const unidade = produto?.unidade_metrica ?? "m";
    const metrica = produto?.metrica ?? "métrica";

    return {
      ...linha,
      rotulo_exibicao:
        linha.rotulo ??
        `${Number(linha.valor)}${unidade} (${metrica})`,
    };
  }

  static formatLinesForResponse(linhas, produto) {
    return linhas.map((linha) =>
      PriceLineService.formatLineForResponse(linha, produto)
    );
  }
}

module.exports = PriceLineService;
