
const { Venda, VendaProduto, Produto, sequelize } = require("../../models");

// listar
async function listar(req, res) {
  const vendas = await Venda.findAll();
  res.status(200).json({ total: vendas.length, vendas });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const venda = await Venda.findByPk(id);

  if (!venda) return res.status(404).json({ erro: "Venda não encontrada" });

  res.status(200).json(venda);
}

// criar
async function criar(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_usuario,
      forma_de_pagamento,
      valor_total,
      produtos,
    } = req.body;

    if (!produtos || produtos.length === 0) {
      throw new Error("Venda sem produtos");
    }

    // 1️⃣ cria a venda
    const novaVenda = await Venda.create(
      {
        id_usuario,
        forma_de_pagamento,
        valor_total,
      },
      { transaction }
    );

    // 2️⃣ processa produtos
    for (const item of produtos) {

      // 🔥 CORREÇÃO AQUI
      const quantidade = item.quantidade;

      // busca produto
      const produto = await Produto.findByPk(item.id_produto, {
        transaction,
      });

      if (!produto) {
        throw new Error("Produto não encontrado.");
      }

      // valida estoque
      if (produto.quantidade_atual < quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}`);
      }

      // 3️⃣ salva na tabela venda_produto
      await VendaProduto.create(
        {
          id_venda: novaVenda.id_venda,
          id_produto: item.id_produto,
          quantidade: quantidade,
        },
        { transaction }
      );

      // 4️⃣ baixa estoque
      await produto.update(
        {
          quantidade_atual: produto.quantidade_atual - quantidade,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(201).json(novaVenda);

  } catch (err) {
    await transaction.rollback();

    return res.status(400).json({
      erro: err.message,
    });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await Venda.update(req.body, {
    where: { id_venda: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Venda não encontrada" });

  const vendaAtualizada = await Venda.findByPk(id);

  res.status(200).json(vendaAtualizada);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await Venda.destroy({
    where: { id_venda: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Venda não encontrada" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};