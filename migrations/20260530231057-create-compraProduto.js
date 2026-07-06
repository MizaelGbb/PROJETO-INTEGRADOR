"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("compra_produto", {
      id_compra: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,

        references: {
          model: "compra",
          key: "id_compra",
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
    await queryInterface.dropTable("compra_produto");
  },
};
