"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DescontoProduto extends Model {
    static associate(models) {
      DescontoProduto.belongsTo(models.Desconto, {
        foreignKey: "id_desconto",
        as: "dadosDesconto",
      });

      DescontoProduto.belongsTo(models.Produto, {
        foreignKey: "id_produto",
        as: "produto",
      });
    }
  }

  DescontoProduto.init(
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
      id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "produtos",
          key: "id_produto",
        },
      },
      novo_valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "O novo valor do produto não pode ser negativo",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "desconto_produto",
      timestamps: true,
      underscored: true,
    },
  );

  return DescontoProduto;
};
