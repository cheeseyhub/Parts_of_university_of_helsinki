const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

usersRouter.post("/", async (request, response, next) => {
  const { username, password, name } = request.body;
  if (!password) {
    return response.status(400).json({
      error: "Password is required.",
    });
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: "The password length must be at least three characters.",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    username,
    name,
    password: passwordHash,
  });
  const savedBlog = await newUser.save();
  return response.status(200).json(savedBlog);
});
usersRouter.get("/", async (request, response, next) => {
  const users = await User.find({}).populate("blogs");
  return response.status(201).json(users);
});

module.exports = usersRouter;
