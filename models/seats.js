const hash = require("object-hash");

module.exports = (sequelize, Sequelize) => {
  const tableName = "SEATS";
  const seats = sequelize.define(
    tableName,
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      flight_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      tableName: tableName,
    }
  );

  seats.associate = (Models) => {
    seats.belongsTo(Models.Flights, {
      as: "seats",
      foreignKey: "flight_id",
      sourceKey: "id",
    });
    // seats.belongsTo(Models.SeatType, {
    //   as: "seatType",
    //   foreignKey: "seat_id",
    //   sourceKey: "id",
    // });
  };

  seats.seedData = async () => {
    const seedData = await require("../seeders/seatsSeed");
    const dbData = (await seats.findAll({ logging: false })).map((el) => {
      el.toJSON();
    });

    if (hash(dbData) !== hash(seedData)) {
      await seats.destroy({ where: {} });
      await seats.bulkCreate(seedData, { logging: false });
    }
  };

  return seats;
};
