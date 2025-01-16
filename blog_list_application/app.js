const express = require("express");
const { URL } = require("./utils/config");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogRouter");
const middlewares = require("./utils/middlewares");

app.use(cors());
app.use(express.json());
app.use(middlewares.requestLogger);
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Error connecting to database");
  });
app.get("/", (request, response) => {
  response.send("<h1>This is the root</h1>");
});
app.use("/api/blogs", blogRouter);
app.use(middlewares.errorHandler);
app.use(middlewares.unknownEndPoint);
module.exports = app;
