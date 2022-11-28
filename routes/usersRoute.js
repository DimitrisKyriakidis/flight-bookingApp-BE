const router = require("express").Router();
const routeName = "/api/users";

router.post("/login", require("../apis/Users/login"));

router.get("/getAllUsers", require("../apis/Users/getAllUsers"));

module.exports = { routeName, router };