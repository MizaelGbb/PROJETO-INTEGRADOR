const { Usuario } = require("../../models");

// listar
async function listar(req, res) {
  const usuarios = await Usuario.findAll();
  res.status(200).json({ total: usuarios.length, usuarios });
}

// buscar
async function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const usuario = await Usuario.findByPk(id);

  if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

  res.status(200).json(usuario);
}

// criar
async function criar(req, res) {
  try {
    const novoUsuario = await Usuario.create(req.body);

    res
      .status(201)
      .set("Location", "/api/usuarios/" + novoUsuario.id_usuario)
      .json(novoUsuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

// atualizar
async function atualizar(req, res) {
  const id = parseInt(req.params.id);

  const [qtd] = await Usuario.update(req.body, {
    where: { id_usuario: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

  const usuarioAtualizado = await Usuario.findByPk(id);

  res.status(200).json(usuarioAtualizado);
}

// remover
async function remover(req, res) {
  const id = parseInt(req.params.id);

  const qtd = await Usuario.destroy({
    where: { id_usuario: id },
  });

  if (qtd === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

  res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};