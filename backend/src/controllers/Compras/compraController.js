const { Compra, fornecedor } = require("../../models");

// LISTAR TODAS
const listar = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: {
        model: fornecedor,
        as: "fornecedor",
      },
    });

    return res.json(compras);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao listar compras" });
  }
};

// BUSCAR POR ID
const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await Compra.findByPk(id, {
      include: {
        model: fornecedor,
        as: "fornecedor",
      },
    });

    if (!compra) {
      return res.status(404).json({ erro: "Compra não encontrada" });
    }

    return res.json(compra);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar compra" });
  }
};

// CRIAR
const criar = async (req, res) => {
  try {
    const { data, forma_de_pagamento, valor_total, id_fornecedor } = req.body;

    const novaCompra = await Compra.create({
      data,
      forma_de_pagamento,
      valor_total,
      id_fornecedor,
    });

    return res
      .status(201)
      .set("Location", `/api/compras/${novaCompra.id_compra}`)
      .json(novaCompra);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao criar compra" });
  }
};

// ATUALIZAR
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await Compra.findByPk(id);

    if (!compra) {
      return res.status(404).json({ erro: "Compra não encontrada" });
    }

    const { data, forma_de_pagamento, valor_total, id_fornecedor } = req.body;

    await compra.update({
      data,
      forma_de_pagamento,
      valor_total,
      id_fornecedor,
    });

    return res.json(compra);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao atualizar compra" });
  }
};

// REMOVER
const remover = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await Compra.findByPk(id);

    if (!compra) {
      return res.status(404).json({ erro: "Compra não encontrada" });
    }

    await compra.destroy();

    return res.status(204).send(); 
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover compra" });
  }
};

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};