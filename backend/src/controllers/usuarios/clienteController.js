const { Cliente, Venda, Produto } = require("../../models");

// listar
async function listar(req, res) {
  const clientes = await Cliente.findAll();
  res.status(200).json({ total: clientes.length, clientes });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const cliente = await Cliente.findByPk(id);

  if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });

  res.status(200).json(cliente);
}

// criar
async function criar(req, res) {
  try {
    const novoCliente = await Cliente.create(req.body);

    res
      .status(201)
      .set("Location", "/api/clientes/" + novoCliente.id_usuario)
      .json(novoCliente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await Cliente.update(req.body, {
    where: { id_usuario: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Cliente não encontrado" });

  const clienteAtualizado = await Cliente.findByPk(id);

  res.status(200).json(clienteAtualizado);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await Cliente.destroy({
    where: { id_usuario: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Cliente não encontrado" });

  res.status(204).send();
}

async function historico(req, res) {
  const { id } = req.params;

  try {
    const vendas = await Venda.findAll({
      where: { id_usuario: id },

      include: [
        {
          model: Produto,
          as: "produtos",
          through: {
            attributes: ["quantidade"],
          },
        },
      ],

      order: [["data", "DESC"]],
    });

    res.json(vendas);

  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao buscar histórico."
    });
  }
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
  historico,
};