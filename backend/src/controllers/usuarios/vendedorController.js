
const bcrypt = require("bcrypt");
const { Vendedor, Usuario, sequelize } = require("../../models");

async function registrarFuncionario(req, res) {
const transaction = await sequelize.transaction();

try {
  const { nome, email, senha, telefone, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      throw new Error("Dados obrigatórios faltando");
    }
    
    if (!["vendedor", "gerente"].includes(tipo)) {
      throw new Error("Tipo inválido");
    }
    
    const usuarioExistente = await Usuario.findOne({
      where: { email },
      transaction,
    });
    
    if (usuarioExistente) {
      throw new Error("Email já cadastrado");
    }
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      telefone,
      tipo: "vendedor",
    }, { transaction });
    
    const novoVendedor = await Vendedor.create({
      id_usuario: novoUsuario.id_usuario,
      tipo,
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(201).json({
      message: "Funcionário cadastrado",
      id: novoVendedor.id_usuario,
    });
    
    } catch (err) {
    await transaction.rollback();
    
    return res.status(400).json({
      erro: err.message,
    });
  }
}



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

atualizar,
remover,
registrarFuncionario
};
