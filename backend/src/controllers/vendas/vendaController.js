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

    // cria a venda
    const novaVenda = await Venda.create(
      {
        id_usuario,
        forma_de_pagamento,
        valor_total,
      },
      { transaction }
    );

    // percorre todos os produtos vendidos
    for (const item of produtos) {

      // salva na tabela venda_produto
      await VendaProduto.create(
        {
          id_venda: novaVenda.id_venda,
          id_produto: item.id_produto,
          quantidade: item.quantity,
        },
        { transaction }
      );

      // busca o produto
      const produto = await Produto.findByPk(item.id_produto, {
        transaction,
      });

      if (!produto) {
        throw new Error("Produto não encontrado.");
      }

      // verifica estoque
      if (produto.quantidade_atual < item.quantity) {
        throw new Error(`Estoque insuficiente para ${produto.nome}`);
      }

      // baixa o estoque
      await produto.update(
        {
          quantidade_atual:
            produto.quantidade_atual - item.quantity,
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