"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.hasMany(models.Produto, {
        foreignKey: "id_categoria",
        as: "produtos",
      });
      Categoria.hasMany(models.DescontoCategoria, {
        foreignKey: "id_categoria",
        as: "descontos",
      });
    }
  }

  Categoria.init(
    {
      id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: { msg: "Esta categoria já está cadastrada" },
        validate: {
          notEmpty: { msg: "O nome da categoria não pode ser vazio" },
          len: {
            args: [2, 50],
            msg: "O nome deve ter entre 2 and 50 caracteres.",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "categorias",
      timestamps: true,
      underscored: true,
    },
  );

  return Categoria;
};
