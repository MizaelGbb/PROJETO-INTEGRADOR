"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vendedor", {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id_usuario",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tipo: {
        type: Sequelize.ENUM("vendedor", "gerente"),
        allowNull: false,
        defaultValue: "vendedor",
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

  async down(queryInterface) {
    await queryInterface.dropTable("vendedor");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_vendedor_tipo";');
  },
};