const Models = require("../../database/DB").Models;
const apiName = "getAllUsers";
const logger = require("../../Logger/winstonLogger").logger;
const loggingPolicy = require("../../Logger/loggingPolicy").loggingPolicy;

module.exports = async(req, res) => {
    try {
        logger.info(
            `Code: ${loggingPolicy.functionEnter.code}  ${apiName}  ${loggingPolicy.functionEnter.message}`
        );

        const users = await Models.Users.findAll({});

        logger.info(
            `Code: ${loggingPolicy.successQuery.code},  ${apiName}  ${loggingPolicy.successQuery.message}`
        );
        res.status(200).send(users);
    } catch (err) {
        logger.error(
            `Code: ${loggingPolicy.catchError.code}, ${apiName}  ${loggingPolicy.catchError.message}`
        );
        res.status(400).send({ message: "Sorry, something went wrong " + err });
    }
};