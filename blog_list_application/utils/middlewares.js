const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const requestLogger = (request, response, next) => {
  logger.info("Method", request.method);
  logger.info("Path", request.path);
  logger.info("Body", request.body);

  next();
};
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.code === 11000 && error.name === "MongoServerError") {
    return response.status(400).json({ error: "The username must be unique." });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Token Invalid." });
  }
  next(error);
};

const unknownEndPoint = (request, response) => {
  return response.status(400).send({ error: "Page not found." });
};

const tokenExtracter = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};
const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const user = await User.findById(decodedToken.id);
  console.log(decodedToken);
  request.user = user;
  next();
};
module.exports = {
  errorHandler,
  unknownEndPoint,
  requestLogger,
  tokenExtracter,
  userExtractor,
};
