"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("compra", {
      id_compra: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      data: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      forma_de_pagamento: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      valor_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      id_fornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "fornecedor", 
          key: "id_fornecedor", 
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
    await queryInterface.dropTable("compra");
  },
};
