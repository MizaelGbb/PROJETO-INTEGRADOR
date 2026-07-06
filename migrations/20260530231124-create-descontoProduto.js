"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("desconto_produto", {
      id_desconto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "descontos",
          key: "id_desconto",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "produtos",
          key: "id_produto",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      novo_valor: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable("desconto_produto");
  },
};
