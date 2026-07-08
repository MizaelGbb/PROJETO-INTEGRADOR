"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      Produto.belongsTo(models.Categoria, {
        foreignKey: "id_categoria",
        as: "categoria",
      });
      Produto.belongsToMany(models.Venda, {
        through: models.VendaProduto,
        foreignKey: "id_produto",
        otherKey: "id_venda",
        as: "vendas",
      });
      Produto.belongsToMany(models.Compra, {
        through: models.CompraProduto,
        foreignKey: "id_produto",
        otherKey: "id_compra",
        as: "compras",
      });
      Produto.hasMany(models.DescontoProduto, {
        foreignKey: "id_produto",
        as: "descontos",
      });
    }
  }

  Produto.init(
    {
      id_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome do produto não pode ser vazio" },
        },
      },
      id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categorias",
          key: "id_categoria",
        },
      },
      custo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isDecimal: { msg: "O valor de custo deve ser um número válido" },
          min: { args: [0], msg: "O custo não pode ser menor que zero" },
        },
      },
      valor_final: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: "O valor final deve ser um número válido" },
          min: { args: [0], msg: "O valor final não pode ser menor que zero" },
        },
      },
      estoque_minimo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: { msg: "O estoque mínimo deve ser um número inteiro" },
        },
      },
      quantidade_atual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: { msg: "A quantidade atual deve ser um número inteiro" },
        },
      },
    },
    {
      sequelize,
      tableName: "produtos",
      timestamps: true,
      underscored: true,
    },
  );

  return Produto;
};
