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
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
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

  const addDays = (days) => {
    const currentDate = new Date();
    const resultDays = currentDate.setDate(currentDate.getDate() + days);
    return resultDays;
  };

  flights.seedData = async () => {
    let seedData = await require("../seeders/flightsSeed");

    const now = new Date();

    seedData = seedData.map((el) => {
      if (el.id === "cc356667") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(2),
        };
      }
      if (el.id === "grt45654") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(7),
        };
      }
      if (el.id === "j4563") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(7),
        };
      }
      if (el.id === "r654wt") {
        return {
          ...el,
          dateFrom: addDays(3),
          dateTo: addDays(8),
        };
      }

      if (el.id === "vtr34") {
        return {
          ...el,
          dateFrom: addDays(12),
          dateTo: addDays(16),
        };
      }

      if (el.id === "tr5473") {
        return {
          ...el,
          dateFrom: addDays(2),
          dateTo: addDays(9),
        };
      }

      if (el.id === "fe24563") {
        return {
          ...el,
          dateFrom: addDays(4),
          dateTo: addDays(8),
        };
      }
      if (el.id === "gu53356") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(4),
        };
      }
      if (el.id === "jo3423") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(2),
        };
      }

      if (el.id === "wet546") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(3),
        };
      }

      if (el.id === "by4456") {
        return {
          ...el,
          dateFrom: addDays(6),
          dateTo: addDays(11),
        };
      }

      if (el.id === "cwe24657") {
        return {
          ...el,
          dateFrom: addDays(1),
          dateTo: addDays(6),
        };
      }

      if (el.id === "ay432r") {
        return {
          ...el,
          dateFrom: now,
          dateTo: addDays(3),
        };
      }

      if (el.id === "nrt942") {
        return {
          ...el,
          dateFrom: addDays(2),
          dateTo: addDays(12),
        };
      }

      return el;
    });

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
