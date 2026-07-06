"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vendedor extends Model {
    static associate(models) {
      Vendedor.belongsTo(models.Usuario, {
        foreignKey: "id_usuario",
        as: "dadosUsuario",
      });
    }

    getNomeCompleto() {
      return this.dadosUsuario ? this.dadosUsuario.nome : "Nome não carregado";
    }
  }

  Vendedor.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuarios",
      },
    },
    tipo: {
      type: DataTypes.ENUM("vendedor", "gerente"),
      allowNull: false,
      defaultValue: "vendedor",
      validate: {
          isIn: {
            args: [["gerente", "vendedor"]],
            msg: "Tipo deve ser 'gerente' ou 'vendedor'",
          },},
    },
  },
  
    {
      sequelize,
      tableName: "vendedor",
      timestamps: true,
      underscored: true,
    },
  );

  return Vendedor;
};
