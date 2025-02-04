const jwt = require("jsonwebtoken");
const User = require("../models/user");
const LoginRouter = require("express").Router();
const bcrypt = require("bcrypt");

LoginRouter.post("/", async (request, response, next) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  //Comparing the enterned password with the userPassword
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);

  //If there is no user or password doesn't match
  if (!user && !passwordCorrect) {
    return response.status(401).json({
      error: "The username or password is invalid",
    });
  }

  //Making the user token
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  // 60 * 60 is an hour so token expires in an hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

module.exports = LoginRouter;
