const router = require("express").Router();
const routeName = "/api/flights";

router.get("/getAllFlights", require("../apis/flights/getAllFlights"));
router.post("/searchFlights", require("../apis/flights/searchFlights"));

module.exports = { routeName, router };
