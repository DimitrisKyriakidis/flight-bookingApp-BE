"use strict";
const path = require("path");
require("dotenv").config({
    path: !!process.env.NODE_ENV ?
        __dirname + `/.env.${process.env.NODE_ENV}` : __dirname + "/.env.development",
});

const express = require('express');
const cors = require("cors");

const logger = require("./Logger/winstonLogger").logger;
const loggingPolicy = require("./Logger/loggingPolicy").loggingPolicy;
const DB = require("./database/DB");

const app = express();

app.use(cors()); // allows our Angular application to make HTTP requests to Express application
app.use(express.json());

require("dotenv/config");

// app.listen(3000, () => {
//     console.log("server is running localhost");
// })

//Connect to Database
DB.connect()
    .catch((err) => {
        logger.error(
            `Code: ${loggingPolicy.failDatabaseConnection.code}, ${loggingPolicy.failDatabaseConnection.message}`
        );
        console.error("DB connection error: ", err);
    })
    .then(() => {
        // Routes should be specified on   ./routes/  dir
        // and autoloaded here
        console.log("..API Loading");
        require("fs")
            .readdirSync(path.join(__dirname, "routes"))
            .forEach((file) => {
                let r = require(path.join(__dirname, "routes", file));
                app.use(r.routeName, r.router);
            });
        console.log("◉ API Loaded");

        // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            return res
                .status(err.status || 500)
                .send({ message: res.locals.message });
        });
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            return res.status(404).send({ message: "Not found" });
        });
    });

module.exports = app;