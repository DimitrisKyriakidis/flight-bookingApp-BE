const router = require("express").Router();
const routeName = "/api/flights";

router.post("/getAllFlights", require("../apis/flights/getAllFlights"));

module.exports = { routeName, router };
