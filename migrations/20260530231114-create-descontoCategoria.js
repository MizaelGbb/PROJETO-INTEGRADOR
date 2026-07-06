"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("desconto_categoria", {
      id_desconto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "descontos",
          key: "id_desconto",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categorias",
          key: "id_categoria",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      porcentagem_desconto: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("desconto_categoria");
  },
};
