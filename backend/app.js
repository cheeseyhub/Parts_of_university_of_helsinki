const config = require("./utils/config");
const express = require("express");
const app = express();
const personRouter = require("./controllers/persons");
const morgan = require("morgan");
const middlewares = require("./utils/middleware");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
const mongoose = require("mongoose");
console.log("Connecting.........");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch(() => {
    console.log("Error connecting to the database.");
  });

app.use(express.json());
morgan.token("resContent", (request) => JSON.stringify(request.body));
app.use(morgan(":method :url :status :response-time ms :resContent"));
app.use("/api/persons/", personRouter);
app.use(express.static("dist"));

app.use(middlewares.errorHandler);
app.use(middlewares.unknownEndpoint);
module.exports = app;
