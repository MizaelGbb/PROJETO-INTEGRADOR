const { Fornecedor } = require("../../models");

// LISTAR TODOS
const listar = async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll();
    return res.json(fornecedores);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao listar fornecedores" });
  }
};

// BUSCAR POR ID
const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      return res.status(404).json({ erro: "Fornecedor não encontrado" });
    }

    return res.json(fornecedor);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar fornecedor" });
  }
};

// CRIAR
const criar = async (req, res) => {
  try {
    const { nome, email, telefone, cnpj } = req.body;

    const novoFornecedor = await Fornecedor.create({
      nome,
      email,
      telefone,
      cnpj,
    });

    return res
      .status(201)
      .set("Location", `/api/fornecedores/${novoFornecedor.id_fornecedor}`)
      .json(novoFornecedor);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao criar fornecedor",
    });
  }
};

// ATUALIZAR
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      return res.status(404).json({ erro: "Fornecedor não encontrado" });
    }

    const { nome, email, telefone, cnpj } = req.body;

    await fornecedor.update({
      nome,
      email,
      telefone,
      cnpj,
    });

    return res.json(fornecedor);
  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao atualizar fornecedor",
    });
  }
};

// REMOVER
const remover = async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      return res.status(404).json({ erro: "Fornecedor não encontrado" });
    }

    await fornecedor.destroy();

    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover fornecedor" });
  }
};

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};