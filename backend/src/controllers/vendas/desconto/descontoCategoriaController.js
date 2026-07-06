const { DescontoCategoria } = require("../../../models");

// listar
async function listar(req, res) {
  const descontosCategoria = await DescontoCategoria.findAll();
  res.status(200).json({ total: descontosCategoria.length, descontosCategoria });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const descontoCategoria = await DescontoCategoria.findByPk(id);

  if (!descontoCategoria) return res.status(404).json({ erro: "Desconto por categoria não encontrado" });

  res.status(200).json(descontoCategoria);
}

// criar
async function criar(req, res) {
  try {
    const novoDescontoCategoria = await DescontoCategoria.create(req.body);

    res
      .status(201)
      .set("Location", "/api/descontos-categoria/" + novoDescontoCategoria.id_desconto)
      .json(novoDescontoCategoria);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await DescontoCategoria.update(req.body, {
    where: { id_desconto: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Desconto por categoria não encontrado" });

  const descontoCategoriaAtualizado = await DescontoCategoria.findByPk(id);

  res.status(200).json(descontoCategoriaAtualizado);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await DescontoCategoria.destroy({
    where: { id_desconto: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Desconto por categoria não encontrado" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};