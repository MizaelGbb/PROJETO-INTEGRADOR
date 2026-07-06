const { Categoria, Produto, DescontoCategoria } = require("../../models");

// LISTAR TODAS
const listar = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      include: [
        { model: Produto, as: "produtos" },
        { model: DescontoCategoria, as: "descontos" },
      ],
    });

    return res.json(categorias);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao listar categorias" });
  }
};

// BUSCAR POR ID
const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [
        { model: Produto, as: "produtos" },
        { model: DescontoCategoria, as: "descontos" },
      ],
    });

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    return res.json(categoria);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar categoria" });
  }
};

// CRIAR
const criar = async (req, res) => {
  try {
    const { nome } = req.body;

    const novaCategoria = await Categoria.create({ nome });

    return res
      .status(201)
      .set("Location", `/api/categorias/${novaCategoria.id_categoria}`)
      .json(novaCategoria);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao criar categoria",
    });
  }
};

// ATUALIZAR
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const { nome } = req.body;

    await categoria.update({ nome });

    return res.json(categoria);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao atualizar categoria",
    });
  }
};

// REMOVER
const remover = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    await categoria.destroy();

    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover categoria" });
  }
};

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};