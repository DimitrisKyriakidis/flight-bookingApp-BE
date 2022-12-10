const uuid = require("uuid").v4;
const Models = require("../database/DB").Models;
const Op = require("sequelize").Op;
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const { sequelize } = require("../database/DB");
const seats = require("../models/seats");

class Flights {
  async getAllFlights() {
    return await Models.Flights.findAll({});
  }

  async searchFlights(from, to, dateFrom, dateTo, seatType, passengers, sort) {
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
      order: sort,
    });
    for (let flight of allFlights) {
      const seats = await Models.Seats.findAndCountAll({
        where: {
          type: seatType,
          flight_id: flight.id,
        },
      });

      const { count: availableSeats } = seats;
      console.log("availableSeats=", availableSeats);
      if (availableSeats === 0) {
        flight.setDataValue("availableSeats", 0);
      }
      for (let seat of seats.rows) {
        if (availableSeats > 0 && availableSeats >= passengers) {
          if (seat.flight_id === flight.id) {
            flight.setDataValue("seats", seats.rows);
            flight.setDataValue("availableSeats", availableSeats);
          }
        } else return (allFlights = []);
      }
    }
    return allFlights;
  }

  async saveFlight(body) {
    let passengersModels = body.passengers.forEach(async (element) => {
      await Models.Passengers.create({
        firstName: element.firstName,
        lastName: element.lastName,
        gender: element.gender,
        birthDate: element.birthDate,
        flight_id: body.filters.id, //flight id
      });
    });

    let seats = await Models.Seats.findAll({
      where: {
        type: body.filters.seatType,
        flight_id: body.filters.id,
      },
      limit: body.passengers.length,
    }).then((results) => {
      results = results.map((res) => res.id);
      results.forEach(async (id) => {
        await Models.Seats.destroy({
          where: {
            id: id,
          },
        });
      });
    });
  }
}

module.exports = { Flights };
