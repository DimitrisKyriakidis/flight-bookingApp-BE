const router = require("express").Router();
const routeName = "/api/flights";

router.get("/getAllFlights", require("../apis/flights/getAllFlights"));
router.post("/searchFlights", require("../apis/flights/searchFlights"));

router.post("/saveFlight", require("../apis/flights/saveFlight"));

module.exports = { routeName, router };
