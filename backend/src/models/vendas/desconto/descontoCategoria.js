"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DescontoCategoria extends Model {
    static associate(models) {
      DescontoCategoria.belongsTo(models.Desconto, {
        foreignKey: "id_desconto",
        as: "dadosDesconto",
      });

      DescontoCategoria.belongsTo(models.Categoria, {
        foreignKey: "id_categoria",
        as: "categoria",
      });
    }
  }

  DescontoCategoria.init(
    {
      id_desconto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "desconto",
          key: "id_desconto",
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
      porcentagem_desconto: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: { args: [0], msg: "O desconto não pode ser menor que 0%" },
          max: { args: [100], msg: "O desconto não pode ser maior que 100%" },
        },
      },
    },
    {
      sequelize,
      tableName: "desconto_categoria",
      timestamps: true,
      underscored: true,
    },
  );

  return DescontoCategoria;
};
