"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VendaProduto extends Model {
    static associate(models) {
      VendaProduto.belongsTo(models.Venda, {
        foreignKey: "id_venda",
        as: "venda",
      });

      VendaProduto.belongsTo(models.Produto, {
        foreignKey: "id_produto",
        as: "produto",
      });
    }
  }

  VendaProduto.init(
    {
      id_venda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "vendas",
          key: "id_venda",
        },
      },
      id_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "produtos",
          key: "id_produto",
        },
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isInt: { msg: "A quantidade deve ser um número inteiro" },
          min: { args: [1], msg: "A quantidade vendida deve ser no mínimo 1" },
        },
      },
    },
    {
      sequelize,
      tableName: "venda_produto",
      timestamps: true,
      underscored: true,
    },
  );

  return VendaProduto;
};
