const { CompraProduto, Compra, Produto } = require("../../models");

// LISTAR TODOS
const listar = async (req, res) => {
  try {
    const registros = await CompraProduto.findAll({
      include: [
        { model: Compra, as: "compra" },
        { model: Produto, as: "produto" },
      ],
    });

    return res.json(registros);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao listar itens da compra" });
  }
};

// BUSCAR (chave composta)
const buscar = async (req, res) => {
  try {
    const { id_compra, id_produto } = req.params;

    const item = await CompraProduto.findOne({
      where: { id_compra, id_produto },
    });

    if (!item) {
      return res.status(404).json({ erro: "Item não encontrado" });
    }

    return res.json(item);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar item" });
  }
};

// CRIAR
const criar = async (req, res) => {
  try {
    const { id_compra, id_produto, quantidade } = req.body;

    const novoItem = await CompraProduto.create({
      id_compra,
      id_produto,
      quantidade,
    });

    return res
      .status(201)
      .set(
        "Location",
        `/api/compra-produto/${id_compra}/${id_produto}`
      )
      .json(novoItem);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao criar item",
    });
  }
};

// ATUALIZAR
const atualizar = async (req, res) => {
  try {
    const { id_compra, id_produto } = req.params;

    const item = await CompraProduto.findOne({
      where: { id_compra, id_produto },
    });

    if (!item) {
      return res.status(404).json({ erro: "Item não encontrado" });
    }

    const { quantidade } = req.body;

    await item.update({ quantidade });

    return res.json(item);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao atualizar item",
    });
  }
};

// REMOVER
const remover = async (req, res) => {
  try {
    const { id_compra, id_produto } = req.params;

    const item = await CompraProduto.findOne({
      where: { id_compra, id_produto },
    });

    if (!item) {
      return res.status(404).json({ erro: "Item não encontrado" });
    }

    await item.destroy();

    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover item" });
  }
};

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};