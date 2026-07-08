const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const senhaHash = await bcrypt.hash("123456", 10);

    const [usuario] = await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nome: "Gerente Inicial",
          email: "gerente@admin.com",
          senha: senhaHash,
          telefone: "49999999999",
          tipo: "vendedor",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    await queryInterface.bulkInsert("vendedor", [
      {
        id_usuario: usuario.id_usuario,
        tipo: "gerente",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vendedor", null, {});

    await queryInterface.bulkDelete("usuarios", {
      email: "gerente@admin.com",
    });
  },
};
