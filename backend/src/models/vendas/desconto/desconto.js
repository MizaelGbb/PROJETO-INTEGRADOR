"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Desconto extends Model {
    static associate(models) {
      Desconto.hasMany(models.DescontoCategoria, {
        foreignKey: "id_desconto",
        as: "porCategoria",
      });
      Desconto.hasMany(models.DescontoProduto, {
        foreignKey: "id_desconto",
        as: "porProduto",
      });
    }
  }
  Desconto.init(
    {
      id_desconto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      data_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      data_fim: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      publico: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Desconto",
      tableName: "descontos",
      timestamps: true,
      underscored: true,
    },
  );
  return Desconto;
};
