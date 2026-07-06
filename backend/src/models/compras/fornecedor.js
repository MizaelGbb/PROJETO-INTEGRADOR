"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Fornecedor extends Model {
    static associate(models) {
      
    }
  }

  Fornecedor.init(
    {
      id_fornecedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome não pode ser vazio" },
        },
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: { msg: "Email já cadastrado" },
        validate: {
          isEmail: { msg: "Email inválido" },
        },
      },

      telefone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      cnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: { msg: "CNPJ já cadastrado" },
        validate: {
          is: {
            args: /^\d{14}$/,
            msg: "CNPJ deve ter 14 dígitos numéricos",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Fornecedor",
      tableName: "fornecedor",
      timestamps: true,
      underscored: true,
    },
  );

  return Fornecedor;
};
