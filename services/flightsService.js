const { Model } = require("sequelize");
const uuid = require("uuid").v4;
const Models = require("../database/DB").Models;
const Op = require("sequelize").Op;
const Sequelize = require("sequelize");
const { sequelize } = require("../database/DB");
const { QueryTypes } = require("sequelize");

class Flights {
  async getAllFlights(from, to, dateFrom, dateTo, seatType) {
    let rangeOptions = {};

    if (from && to && !dateFrom && !dateTo) {
      rangeOptions = {
        from: {
          [Op.eq]: from,
        },
        to: {
          [Op.eq]: to,
        },
      };
    } else if (from && to && dateFrom && dateTo) {
      rangeOptions = {
        from: {
          [Op.eq]: from,
        },
        to: {
          [Op.eq]: to,
        },
        dateFrom: {
          [Op.and]: {
            [Op.gte]: dateFrom,
            [Op.lte]: dateTo,
          },
        },
        dateTo: {
          [Op.and]: {
            [Op.gte]: dateFrom,
            [Op.lte]: dateTo,
          },
        },
      };
    }

    // let sqlQueryForSeats = `SELECT * FROM SEATS WHERE type = '${seatType}'`;

    // let runQuery = await sequelize.query(sqlQueryForSeats);

    //add seat filter type on each flight
    //from the front end by default should for example ("economical")
    let allFlights = await Models.Flights.findAll({
      where: {
        ...rangeOptions,
      },
    });
    for (let flight of allFlights) {
      const seats = await Models.Seats.findAll({
        where: {
          type: seatType,
          flight_id: flight.id,
        },
      });
      for (let seat of seats) {
        if (seat.flight_id === flight.id) {
          flight.setDataValue("seats", seats);
        }
      }
    }
    return allFlights;
  }
}

module.exports = { Flights };
