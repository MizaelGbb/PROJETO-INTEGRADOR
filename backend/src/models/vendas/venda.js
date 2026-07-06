"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Venda extends Model {
    static associate(models) {
      Venda.belongsTo(models.Usuario, {
        foreignKey: "id_usuario",
        as: "usuario",
      });

      Venda.belongsTo(models.Cliente, {
        foreignKey: "id_usuario",
        targetKey: "id_usuario",
        as: "cliente",
      });

      Venda.belongsToMany(models.Produto, {
        through: models.VendaProduto,
        foreignKey: "id_venda",
        otherKey: "id_produto",
        as: "produtos",
      });
    }
  }

  Venda.init(
    {
      id_venda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      forma_de_pagamento: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id_usuario",
        },
      },
    },
    {
      sequelize,
      tableName: "vendas",
      timestamps: true,
      underscored: true,
    },
  );
  return Venda;
};
