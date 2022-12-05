const uuid = require("uuid").v4;
const Models = require("../database/DB").Models;
const Op = require("sequelize").Op;
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const { sequelize } = require("../database/DB");

class Flights {
  async getAllFlights() {
    return await Models.Flights.findAll({});
  }

  async searchFlights(from, to, dateFrom, dateTo, seatType, passengers) {
    let rangeOptions = {
      from: {
        [Op.eq]: from,
      },
      to: {
        [Op.eq]: to,
      },
    };

    if (from && to && !dateFrom && !dateTo) {
      rangeOptions = {
        ...rangeOptions,
      };
    } else if (from && to && dateFrom && dateTo) {
      rangeOptions = {
        ...rangeOptions,

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
    } else if (from && to && dateFrom && !dateTo) {
      rangeOptions = {
        ...rangeOptions,

        dateFrom: {
          [Op.gte]: dateFrom,
        },
      };
    } else if (from && to && dateTo && !dateFrom) {
      rangeOptions = {
        ...rangeOptions,

        dateTo: {
          [Op.lte]: dateTo,
        },
      };
    }

    let allFlights = await Models.Flights.findAll({
      where: {
        ...rangeOptions,
      },
    });
    for (let flight of allFlights) {
      const seats = await Models.Seats.findAndCountAll({
        where: {
          type: seatType,
          flight_id: flight.id,
        },
      });

      const { count: availableSeats } = seats;
      for (let seat of seats.rows) {
        if (availableSeats >= passengers) {
          if (seat.flight_id === flight.id) {
            flight.setDataValue("seats", seats);
            flight.setDataValue("availableSeats", availableSeats);
          }
        } else return (allFlights = []);
      }
    }
    return allFlights;
  }
}

module.exports = { Flights };
