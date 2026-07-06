const { Compra, CompraProduto, Produto, Fornecedor } = require("../../models");

// LISTAR TODAS
const listar = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: {
        model: Fornecedor,
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
        model: Fornecedor,
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
    const {
      id_produto,
      id_fornecedor,
      quantidade,
      custo,
      observacoes,
    } = req.body;

    // Busca o produto
    const produto = await Produto.findByPk(id_produto);

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado",
      });
    }

    // Cria a compra
    const novaCompra = await Compra.create({
      data: new Date(),
      forma_de_pagamento: observacoes || "Entrada de estoque",
      valor_total: custo * quantidade,
      id_fornecedor,
    });

    // Relaciona produto e compra
    await CompraProduto.create({
      id_compra: novaCompra.id_compra,
      id_produto,
      quantidade,
    });

    // Atualiza o estoque
    await produto.update({
      quantidade_atual:
        produto.quantidade_atual + Number(quantidade),
    });

    return res.status(201).json({
      mensagem: "Entrada registrada com sucesso.",
    });

} catch (erro) {
  console.error("========== ERRO AO CRIAR COMPRA ==========");
  console.error(erro);

  return res.status(500).json({
    erro: erro.message,
    detalhe: erro,
  });
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