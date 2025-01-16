const logger = require("./logger");
const requestLogger = (request, response, next) => {
  logger.info("Method", request.method);
  logger.info("Path", request.path);
  logger.info("Body", request.body);

  next();
};
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.send(400).send({ error: "Malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.send(400).send({ error: error.message });
  }
  next(error);
};

const unknownEndPoint = (request, response) => {
  return response.status(400).send({ error: "Page not found." });
};

module.exports = {
  errorHandler,
  unknownEndPoint,
  requestLogger,
};
