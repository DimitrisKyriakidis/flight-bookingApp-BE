const DB = {};
const Sequelize = require("sequelize");
require("dotenv/config");
//Setup sequelize
DB.sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: { timestamps: false },
    logging: process.env.NODE_ENV !== "production" ? console.log : false,
  }
);

//Models Loader
DB.Models = {
  Users: require("../models/users")(DB.sequelize, Sequelize),
  Flights: require("../models/flights")(DB.sequelize, Sequelize),
  Passengers: require("../models/passengers")(DB.sequelize, Sequelize),
  Seats: require("../models/seats")(DB.sequelize, Sequelize),
};

//Seeds Loader
DB.initSeeds = async () => {
  console.log("..DB Seed checking");
  for (const key in DB.Models) {
    if (Object.hasOwnProperty.call(DB.Models, key)) {
      const thisModel = DB.Models[key];
      if (thisModel.seedData) {
        await thisModel.seedData().catch((err) => {
          console.log(key);
          console.log(err);
          throw err.message || err;
        });
      }
    }
  }
};

//Models Ascosciator
DB.initAssociations = () => {
  for (const key in DB.Models) {
    if (Object.hasOwnProperty.call(DB.Models, key)) {
      if (DB.Models[key].associate) {
        DB.Models[key].associate(DB.Models);
      }
    }
  }
};

DB.initAssociations();

//Init Function
DB.initDB = async () => {
  try {
    //Create DB if not exists
    const _conn = await require("mysql2").createConnectionPromise({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    await _conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    await _conn.end();

    //Sync DB
    console.log("..DB Syncing");

    await DB.sequelize.sync({
      force: false,
      logging: false,
      //alter: true,
    });

    await DB.sequelize.authenticate({ logging: false });
    DB.isConnected = true;

    //Load Seeds
    await DB.initSeeds();
  } catch (err) {
    throw err.message || err;
  }
};

DB.isConnected = false;
DB.connect = async () => {
  if (DB.isConnected) {
    console.log("=> Using existing connection.");
    return DB.Models;
  }
  await DB.initDB();
  console.log(`◉ Connected to DB ${process.env.DB_NAME}`);

  return DB.Models;
};

DB.retry = async () => {
  var connRetries = 0;
  while (!DB.isConnected) {
    connRetries++;
    if (connRetries >= Number(process.env.DB_CONNECT_RETRY_LIMIT)) {
      console.error("[ERROR] Could not connect to the database. Server exits");
      process.exit(5);
    }
    // delay some seconds
    // and reconnect
    console.log(
      "..DB reconnecting in " + process.env.DB_CONNECT_RETRY / 1000 + " sec"
    );
    await new Promise((resolve) =>
      setTimeout(resolve, process.env.DB_CONNECT_RETRY)
    );
    await DB.connect().catch((err) => console.error(err.message || err));
  }
};

module.exports = DB;
