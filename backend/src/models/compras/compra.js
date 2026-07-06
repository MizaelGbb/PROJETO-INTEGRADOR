"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {
      Compra.belongsTo(models.Fornecedor, {
        foreignKey: "id_fornecedor",
        as: "fornecedor",
      });
    }
  }

  Compra.init(
    {
      id_compra: {
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
      id_fornecedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "fornecedor",
          key: "id_fornecedor",
        },
      },
    },
    {
      sequelize,
      tableName: "compras",
      timestamps: true,
      underscored: true,
    },
  );
  return Compra;
};
