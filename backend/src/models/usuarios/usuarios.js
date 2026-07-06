"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasOne(models.Cliente, {
        foreignKey: "id_usuario",
        as: "cliente",
      });

      Usuario.hasOne(models.Vendedor, {
        foreignKey: "id_usuario",
        as: "vendedor",
      });

      Usuario.hasMany(models.Venda, {
        foreignKey: "id_usuario",
        as: "vendas",
      });
    }
  }

  Usuario.init(
    {
      id_usuario: {
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
          len: {
            args: [2, 100],
            msg: "Nome deve ter entre 2 e 100 caracteres.",
          },
        },
      },

      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: { msg: "Este e-mail já está cadastrado" },
        validate: {
          isEmail: { msg: "Por favor, insira um email válido." },
        },
      },

      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      telefone: {
        type: DataTypes.STRING(20),
        unique: { msg: "Este numero de telefone já está cadastrado" },
        allowNull: false,
      },

      tipo: {
        type: DataTypes.ENUM("cliente", "vendedor"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["cliente", "vendedor"]],
            msg: "Tipo deve ser 'cliente' ou 'vendedor'",
          },
        },
      },

      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      timestamps: true,
      underscored: true,
    },
  );

  return Usuario;
};