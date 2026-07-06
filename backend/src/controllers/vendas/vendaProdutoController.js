const { VendaProduto } = require("../../models");

// listar
async function listar(req, res) {
  const itensVenda = await VendaProduto.findAll();
  res.status(200).json({ total: itensVenda.length, itensVenda });
}

// buscar
async function buscar(req, res) {
  const id_venda = parseInt(req.params.id_venda);
  const id_produto = parseInt(req.params.id_produto);
  
  if (isNaN(id_venda) || isNaN(id_produto)) {
    return res.status(400).json({ erro: "IDs inválidos" });
  }

  const itemVenda = await VendaProduto.findOne({
    where: { id_venda, id_produto }
  });

  if (!itemVenda) return res.status(404).json({ erro: "Item da venda não encontrado" });

  res.status(200).json(itemVenda);
}

// criar
async function criar(req, res) {
  try {
    const novoItemVenda = await VendaProduto.create(req.body);

    res
      .status(201)
      .set("Location", `/api/vendasProdutos/${novoItemVenda.id_venda}/${novoItemVenda.id_produto}`)
      .json(novoItemVenda);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id_venda = parseInt(req.params.id_venda);
  const id_produto = parseInt(req.params.id_produto);

  const [qtd] = await VendaProduto.update(req.body, {
    where: { id_venda, id_produto },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Item da venda não encontrado" });

  const itemAtualizado = await VendaProduto.findOne({
    where: { id_venda, id_produto }
  });

  res.status(200).json(itemAtualizado);
}

// remover
async function remover(req, res) {
  const id_venda = parseInt(req.params.id_venda);
  const id_produto = parseInt(req.params.id_produto);

  const qtd = await VendaProduto.destroy({
    where: { id_venda, id_produto },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Item da venda não encontrado" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};