const hash = require("object-hash");

module.exports = (sequelize, Sequelize) => {
  const tableName = "PASSENGERS";
  const passengers = sequelize.define(
    tableName,
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      birthDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      flight_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      seat_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      tableName: tableName,
    }
  );

  passengers.associate = (Models) => {
    passengers.belongsTo(Models.Flights, {
      as: "passengers",
      foreignKey: "flight_id",
      sourceKey: "id",
    });
  };

  return passengers;
};
