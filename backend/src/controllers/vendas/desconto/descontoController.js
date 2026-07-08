const { Desconto, DescontoCategoria, DescontoProduto, sequelize } = require("../../../models");

async function listar(req, res) {
  try {
    const descontos = await Desconto.findAll({
      include: [
        { model: DescontoCategoria },
        { model: DescontoProduto }
      ]
    });

    res.status(200).json({ total: descontos.length, descontos });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function criar(req, res) {
  const t = await sequelize.transaction();

  try {
    const {
      data_inicio,
      data_fim,
      publico,
      tipo_desconto,
      id_categoria,
      porcentagem_desconto,
      id_produto,
      novo_valor
    } = req.body;

    // validação básica
    if (!data_inicio || !data_fim) {
      throw new Error("Datas obrigatórias");
    }

    const desconto = await Desconto.create({
      data_inicio,
      data_fim,
      publico
    }, { transaction: t });

    if (tipo_desconto === "categoria") {

      if (!id_categoria || !porcentagem_desconto) {
        throw new Error("Dados de categoria inválidos");
      }

      await DescontoCategoria.create({
        id_desconto: desconto.id_desconto,
        id_categoria,
        porcentagem_desconto
      }, { transaction: t });

    } else if (tipo_desconto === "produto") {

      if (!id_produto || !novo_valor) {
        throw new Error("Dados de produto inválidos");
      }

      await DescontoProduto.create({
        id_desconto: desconto.id_desconto,
        id_produto,
        novo_valor
      }, { transaction: t });

    } else {
      throw new Error("Tipo de desconto inválido");
    }

    await t.commit();

    res.status(201).json(desconto);

  } catch (err) {
    await t.rollback();
    res.status(400).json({ erro: err.message });
  }
}

module.exports = {
  listar,
  criar
};
