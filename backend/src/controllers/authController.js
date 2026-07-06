const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const db = require("../models");

const SALT_ROUNDS = 12;

async function registrar(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const { nome, email, senha, telefone, tipo} = req.body;

    if (!nome || !email || !senha || !telefone || !tipo) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const emailExiste = await db.Usuario.findOne({ where: { email } });

    if (emailExiste) {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    // CRIAR USUARIO
    const usuario = await db.Usuario.create(
      {
        nome,
        email,
        senha: senhaHash,
        telefone,
        tipo,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo
    });
  } catch (error) {
    await t.rollback();

    console.error("ERRO REAL NO CADASTRO:", error);

    return res.status(500).json({ erro: "Erro interno ao registrar usuário" });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
    }

    const usuario = await db.Usuario.findOne({ where: { email } });

    const hashFicticio =
      "$2b$12$invalidhashinvalidhashinvalidhashinvalidhashinvali";
    const senhaValida = await bcrypt.compare(
      senha,
      usuario?.senha ?? hashFicticio,
    );

    if (!usuario || !senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });

    return res.status(200).json({ token, id_usuario: usuario.id_usuario, tipo: usuario.tipo });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno ao realizar login" });
  }
}

module.exports = { registrar, login };

