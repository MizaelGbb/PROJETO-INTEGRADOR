"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      telefone: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      tipo: {
        type: Sequelize.ENUM("cliente", "vendedor"),
        allowNull: false,
      },

      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("usuarios");

    // IMPORTANTE: remover o ENUM manualmente (principalmente no Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_usuarios_tipo";'
    );
  },
};