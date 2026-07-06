const { Vendedor } = require("../../models");

// listar
async function listar(req, res) {
  const vendedores = await Vendedor.findAll();
  res.status(200).json({ total: vendedores.length, vendedores });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const vendedor = await Vendedor.findByPk(id);

  if (!vendedor) return res.status(404).json({ erro: "Vendedor não encontrado" });

  res.status(200).json(vendedor);
}

// criar
async function criar(req, res) {
  try {
    const novoVendedor = await Vendedor.create(req.body);

    res
      .status(201)
      .set("Location", "/api/vendedores/" + novoVendedor.id_usuario)
      .json(novoVendedor);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await Vendedor.update(req.body, {
    where: { id_usuario: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Vendedor não encontrado" });

  const vendedorAtualizado = await Vendedor.findByPk(id);

  res.status(200).json(vendedorAtualizado);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await Vendedor.destroy({
    where: { id_usuario: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Vendedor não encontrado" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};