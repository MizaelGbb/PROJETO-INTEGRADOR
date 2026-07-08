const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Gerar hash da senha
    const senhaHash = await bcrypt.hash("123456", 10);

    // 2. Inserir usuário
    const [usuario] = await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nome: "Gerente Inicial",
          email: "gerente@admin.com",
          senha: senhaHash,
          telefone: "49999999999",
          tipo: "vendedor",
        },
      ],
      { returning: true } // importante pra pegar o ID
    );

    // 3. Inserir na tabela vendedores como gerente
    await queryInterface.bulkInsert("vendedor", [
      {
        id_usuario: usuario.id_usuario, // ou usuario.id (depende do seu model)
        tipo: "gerente",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // remove primeiro o vendedor
    await queryInterface.bulkDelete("vendedor", null, {});

    // depois o usuário
    await queryInterface.bulkDelete("usuarios", {
      email: "gerente@admin.com",
    });
  },
};