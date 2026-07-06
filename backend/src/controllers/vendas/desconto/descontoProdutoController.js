const { DescontoProduto } = require("../../../models");

// listar
async function listar(req, res) {
  const descontosProduto = await DescontoProduto.findAll();
  res.status(200).json({ total: descontosProduto.length, descontosProduto });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const descontoProduto = await DescontoProduto.findByPk(id);

  if (!descontoProduto) return res.status(404).json({ erro: "Desconto por produto não encontrado" });

  res.status(200).json(descontoProduto);
}

// criar
async function criar(req, res) {
  try {
    const novoDescontoProduto = await DescontoProduto.create(req.body);

    res
      .status(201)
      .set("Location", "/api/descontos-produto/" + novoDescontoProduto.id_desconto)
      .json(novoDescontoProduto);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await DescontoProduto.update(req.body, {
    where: { id_desconto: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Desconto por produto não encontrado" });

  const descontoProdutoAtualizado = await DescontoProduto.findByPk(id);

  res.status(200).json(descontoProdutoAtualizado);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await DescontoProduto.destroy({
    where: { id_desconto: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Desconto por produto não encontrado" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};