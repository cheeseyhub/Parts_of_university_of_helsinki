const logger = require("./logger");
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path", request.path);
  logger.info("Body", request.body);
  logger.info("---");
  next();
};

//Error handler
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id " });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};
//unknownEndpoint handler
const unknownEndpoint = (request, response, next) => {
  return response.status(404).send("Page not found.");
};
module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
};
