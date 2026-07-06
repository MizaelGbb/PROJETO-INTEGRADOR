"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CompraProduto extends Model {
    static associate(models) {

      CompraProduto.belongsTo(models.Compra, {
        foreignKey: "id_compra",
        as: "compra",
      });

      CompraProduto.belongsTo(models.Produto, {
        foreignKey: "id_produto",
        as: "produto",
      });
    }
  }

  CompraProduto.init(
    {
      id_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
          model: "compra", 
          key: "id_compra",
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
      tableName: "compra_produto",
      timestamps: true,
      underscored: true,
    },
  );

  return CompraProduto;
};
