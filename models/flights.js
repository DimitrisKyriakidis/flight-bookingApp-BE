const hash = require("object-hash");

module.exports = (sequelize, Sequelize) => {
  const tableName = "FLIGHTS";
  const flights = sequelize.define(
    tableName,
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        // defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      dateFrom: {
        type: Sequelize.DATEONLY,
        // defaultValue: new Date()
      },
      dateTo: {
        type: Sequelize.DATEONLY,
        // defaultValue: new Date(),
      },
    },
    {
      freezeTableName: true,
      tableName: tableName,
    }
  );

  flights.associate = (Models) => {
    flights.hasMany(Models.Passengers, {
      as: "passengers",
      foreignKey: "flight_id",
      sourceKey: "id",
    });
    flights.hasMany(Models.Seats, {
      as: "seats",
      foreignKey: "flight_id",
      sourceKey: "id",
    });
  };

  flights.seedData = async () => {
    const seedData = await require("../seeders/flightsSeed");
    const dbData = (await flights.findAll({ logging: false })).map((el) => {
      el.toJSON();
    });

    if (hash(dbData) !== hash(seedData)) {
      await flights.destroy({ where: {} });
      await flights.bulkCreate(seedData, { logging: false });
    }
  };

  return flights;
};
