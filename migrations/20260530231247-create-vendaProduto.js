"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("venda_produto", {
      id_venda: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "vendas",
          key: "id_venda",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_produto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "produtos",
          key: "id_produto",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    await queryInterface.dropTable("venda_produto");
  },
};
