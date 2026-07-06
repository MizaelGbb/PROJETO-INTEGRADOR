const { Desconto } = require("../../../models");

// listar
async function listar(req, res) {
  const descontos = await Desconto.findAll();
  res.status(200).json({ total: descontos.length, descontos });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const desconto = await Desconto.findByPk(id);

  if (!desconto) return res.status(404).json({ erro: "Desconto não encontrado" });

  res.status(200).json(desconto);
}

// criar
async function criar(req, res) {
  try {
    const novoDesconto = await Desconto.create(req.body);

    res
      .status(201)
      .set("Location", "/api/descontos/" + novoDesconto.id_desconto)
      .json(novoDesconto);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await Desconto.update(req.body, {
    where: { id_desconto: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Desconto não encontrado" });

  const descontoAtualizado = await Desconto.findByPk(id);

  res.status(200).json(descontoAtualizado);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await Desconto.destroy({
    where: { id_desconto: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Desconto não encontrado" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};