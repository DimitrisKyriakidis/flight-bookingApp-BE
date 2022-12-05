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
    let seedData = await require("../seeders/flightsSeed");
    let currentDate = new Date();
    let oneBeforeCurrent = new Date();
    let fourBeforeCurrent = new Date();
    let newDate = new Date();

    // console.log("currentDate=", currentDate);
    // oneBeforeCurrent.setDate(oneBeforeCurrent.getDate() - 1);
    // fourBeforeCurrent.setDate(fourBeforeCurrent.getDate() - 4);
    // console.log("1-Current=", oneBeforeCurrent);
    // console.log("newDate=", newDate.toJSON().substring(0, 10));
    // // newDate.setDate(currentDate.getDate() + 5);
    // console.log("currentDate=", currentDate.toJSON().substring(0, 10));

    seedData = seedData.map((el) => {
      if (el.id === "cc356667") {
        return {
          ...el,
          dateFrom: currentDate.toJSON().substring(0, 10),
          dateTo: newDate.setDate(currentDate.getDate() + 5),
        };
      }
      if (el.id === "grt45654") {
        return {
          ...el,
          dateFrom: currentDate.toJSON().substring(0, 10),
          dateTo: newDate.setDate(currentDate.getDate() + 7),
        };
      }
      if (el.id === "j4563") {
        return {
          ...el,
          dateFrom: currentDate.toJSON().substring(0, 10),
          dateTo: newDate.setDate(currentDate.getDate() + 7),
        };
      }
      if (el.id === "r654wt") {
        return {
          ...el,
          dateFrom: newDate.setDate(currentDate.getDate() + 12),
          dateTo: newDate.setDate(currentDate.getDate() + 19),
        };
      }

      if (el.id === "vtr34") {
        return {
          ...el,
          dateFrom: newDate.setDate(currentDate.getDate() + 8),
          dateTo: newDate.setDate(currentDate.getDate() + 13),
        };
      }

      if (el.id === "tr5473") {
        return {
          ...el,
          dateFrom: newDate.setDate(currentDate.getDate() + 3),
          dateTo: newDate.setDate(currentDate.getDate() + 7),
        };
      }

      if (el.id === "fe24563") {
        return {
          ...el,
          dateFrom: newDate.setDate(currentDate.getDate() + 4),
          dateTo: newDate.setDate(currentDate.getDate() + 8),
        };
      }
      if (el.id === "gu53356") {
        return {
          ...el,
          dateFrom: currentDate.toJSON().substring(0, 10),
          dateTo: newDate.setDate(currentDate.getDate() + 4),
        };
      }
      if (el.id === "jo3423") {
        return {
          ...el,
          dateFrom: currentDate.toJSON().substring(0, 10),
          dateTo: newDate.setDate(currentDate.getDate() + 2),
        };
      }

      if (el.id === "wet546") {
        return {
          ...el,
          dateFrom: currentDate.toJSON().substring(0, 10),
          dateTo: newDate.setDate(currentDate.getDate() + 3),
        };
      }

      if (el.id === "by4456") {
        return {
          ...el,
          dateFrom: newDate.setDate(currentDate.getDate() + 7),
          dateTo: newDate.setDate(currentDate.getDate() + 10),
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
