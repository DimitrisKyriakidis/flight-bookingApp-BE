const logger = require("../../Logger/winstonLogger").logger;
const loggingPolicy = require("../../Logger/loggingPolicy").loggingPolicy;
const paginator = require("../../utils/paginator");
const Flights = require("../../services/flightsService").Flights;
const apiName = "saveFlight";

module.exports = async (req, res) => {
  try {
    logger.info(
      `Code: ${loggingPolicy.functionEnter.code}  ${apiName}  ${loggingPolicy.functionEnter.message}`
    );

    let flightService = new Flights();

    const result = await flightService.saveFlight(req.body);

    logger.info(
      `Code: ${loggingPolicy.successResponse.code},  ${apiName}  ${loggingPolicy.successResponse.message}`
    );
    res.status(200).send({
      message: "Flights retrived!!",
      data: result,
    });
  } catch (err) {
    logger.error(
      `Code: ${loggingPolicy.catchError.code},  ${apiName}  ${loggingPolicy.catchError.message}`
    );
    return res
      .status(400)
      .send({ message: "Sorry, something went wrong: " + err });
  }
};
