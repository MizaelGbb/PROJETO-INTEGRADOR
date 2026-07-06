module.exports = (sequelize, DataTypes) => {
  const { Model } = require("sequelize");

  class Cliente extends Model {
    static associate(models) {
      Cliente.belongsTo(models.Usuario, {
        foreignKey: "id_usuario",
        as: "usuario",
      });

      Cliente.hasMany(models.Venda, {
        foreignKey: "id_usuario",
        sourceKey: "id_usuario",
        as: "vendas",
      });
    }
  }

  Cliente.init(
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
      },

      cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
          is: {
            args: /^\d{11}$/,
            msg: "CPF deve ter exatamente 11 dígitos, sem símbolos",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cliente",
      tableName: "clientes",
      timestamps: true,
      underscored: true,
    },
  );

  return Cliente;
};
