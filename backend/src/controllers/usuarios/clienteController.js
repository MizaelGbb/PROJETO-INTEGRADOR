const bcrypt = require("bcrypt");
const { Cliente, Venda, Produto, Usuario, sequelize } = require("../../models");

// NOVO ENDPOINT SEGURO
async function registrarCliente(req, res) {
const transaction = await sequelize.transaction();

try {
const { nome, email, senha, telefone, cpf } = req.body;


if (!nome || !email || !senha || !cpf) {
  throw new Error("Dados obrigatórios faltando");
}

// verifica email duplicado
const usuarioExistente = await Usuario.findOne({
  where: { email },
  transaction,
});

if (usuarioExistente) {
  throw new Error("Email já cadastrado");
}

// hash da senha
const senhaHash = await bcrypt.hash(senha, 10);

// cria usuário
const novoUsuario = await Usuario.create(
  {
    nome,
    email,
    senha: senhaHash,
    telefone,
    tipo: "cliente",
  },
  { transaction }
);

// verifica CPF duplicado
const clienteExistente = await Cliente.findOne({
  where: { cpf },
  transaction,
});

if (clienteExistente) {
  throw new Error("CPF já cadastrado");
}

// cria cliente
const novoCliente = await Cliente.create(
  {
    id_usuario: novoUsuario.id_usuario,
    cpf,
  },
  { transaction }
);

await transaction.commit();

return res.status(201).json({
  message: "Cliente cadastrado com sucesso",
  id_cliente: novoCliente.id_cliente,
});


} catch (err) {
await transaction.rollback();


return res.status(400).json({
  erro: err.message,
});


}
}


async function listar(req, res) {
const clientes = await Cliente.findAll();
res.status(200).json({ total: clientes.length, clientes });
}

async function buscar(req, res) {
const id = parseInt(req.params.id);
if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

const cliente = await Cliente.findByPk(id);

if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });

res.status(200).json(cliente);
}

async function atualizar(req, res) {
const id = parseInt(req.params.id);

const [qtd] = await Cliente.update(req.body, {
where: { id_usuario: id },
});

if (qtd === 0) return res.status(404).json({ erro: "Cliente não encontrado" });

const clienteAtualizado = await Cliente.findByPk(id);

res.status(200).json(clienteAtualizado);
}

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
through: { attributes: ["quantidade"] },
},
],
order: [["data", "DESC"]],
});


res.json(vendas);


} catch (erro) {
res.status(500).json({ erro: "Erro ao buscar histórico." });
}
}

module.exports = {
listar,
buscar,
atualizar,
remover,
historico,
registrarCliente
};
