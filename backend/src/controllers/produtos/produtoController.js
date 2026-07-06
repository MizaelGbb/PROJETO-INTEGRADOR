const {
  Produto,
  Categoria,
  Compra,
  Venda,
  DescontoProduto,
} = require("../../models");

// LISTAR TODOS
const listar = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        { model: DescontoProduto, as: "descontos" },
      ],
    });

    return res.json(produtos);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao listar produtos" });
  }
};

// BUSCAR POR ID
const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria" },
        { model: DescontoProduto, as: "descontos" },
        { model: Compra, as: "compras" },
        { model: Venda, as: "vendas" },
      ],
    });

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    return res.json(produto);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar produto" });
  }
};

// CRIAR
const criar = async (req, res) => {
  try {
    const {
      nome,
      id_categoria,
      custo,
      valor_final,
      estoque_minimo,
      quantidade_atual,
    } = req.body;

    const novoProduto = await Produto.create({
      nome,
      id_categoria,
      custo,
      valor_final,
      estoque_minimo,
      quantidade_atual,
    });

    return res
      .status(201)
      .set("Location", `/api/produtos/${novoProduto.id_produto}`)
      .json(novoProduto);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao criar produto",
    });
  }
};

// ATUALIZAR
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const {
      nome,
      id_categoria,
      custo,
      valor_final,
      estoque_minimo,
      quantidade_atual,
    } = req.body;

    await produto.update({
      nome,
      id_categoria,
      custo,
      valor_final,
      estoque_minimo,
      quantidade_atual,
    });

    return res.json(produto);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao atualizar produto",
    });
  }
};

// REMOVER
const remover = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await produto.destroy();

    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover produto" });
  }
};

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};