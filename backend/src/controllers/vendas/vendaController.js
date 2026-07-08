
const { 
  Venda, 
  VendaProduto, 
  Produto, 
  Cliente,
  DescontoProduto,
  Desconto,
  DescontoCategoria,
  sequelize 
} = require("../../models");

const { Op } = require("sequelize");

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



// 🔹 CRIAR VENDA
async function criar(req, res) {
  const t = await sequelize.transaction();

  try {
    // 1. ADICIONADO: extrair forma_de_pagamento enviada pelo front-end
    const { id_cliente, produtos, forma_de_pagamento } = req.body;
    const hoje = new Date();

    // ✅ VALIDA CLIENTE
    const cliente = await Cliente.findByPk(id_cliente);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    let total = 0;
    const itensVenda = [];

    for (const item of produtos) {
      const produto = await Produto.findByPk(item.id_produto);

      if (!produto) {
        throw new Error(`Produto ${item.id_produto} não encontrado`);
      }

      let precoOriginal = produto.valor_final;
      let precoFinal = precoOriginal;

      // 🔹 DESCONTO POR PRODUTO
      const descProduto = await DescontoProduto.findOne({
        where: { id_produto: produto.id_produto },
        include: [{
          model: Desconto,
          as: "dadosDesconto",
          where: {
            data_inicio: { [Op.lte]: hoje },
            data_fim: { [Op.gte]: hoje }
          }
        }]
      });

      if (descProduto) {
        precoFinal = descProduto.novo_valor;
      } else {
        // 🔹 DESCONTO POR CATEGORIA
        const descCategoria = await DescontoCategoria.findOne({
          where: { id_categoria: produto.id_categoria },
          include: [{
            model: Desconto,
            as: "dadosDesconto",
            where: {
              data_inicio: { [Op.lte]: hoje },
              data_fim: { [Op.gte]: hoje }
            }
          }]
        });

        if (descCategoria) {
          precoFinal = precoOriginal - (
            precoOriginal * (descCategoria.porcentagem_desconto / 100)
          );
        }
      }

      const subtotal = precoFinal * item.quantidade;
      total += subtotal;

      itensVenda.push({
        id_produto: produto.id_produto,
        quantidade: item.quantidade,
        preco_unitario: precoFinal
      });
    }

    // 🔹 CRIA VENDA (CORRIGIDO AQUI)
    const venda = await Venda.create({
      id_usuario: id_cliente, // 2. Mapeia o id_cliente recebido para o id_usuario que o banco exige
      forma_de_pagamento: forma_de_pagamento || "Dinheiro", // 3. Passa a forma de pagamento
      valor_total: total
    }, { transaction: t });

    // 🔹 SALVA ITENS
    for (const item of itensVenda) {
      await VendaProduto.create({
        id_venda: venda.id_venda,
        ...item
      }, { transaction: t });
    }

    await t.commit();

    return res.json({
      mensagem: "Venda realizada com sucesso",
      venda,
      total
    });

  } catch (erro) {
    await t.rollback();
    console.error(erro);
    return res.status(500).json({ erro: erro.message });
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