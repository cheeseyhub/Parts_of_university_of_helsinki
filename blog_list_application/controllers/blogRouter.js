const blogRouter = require("express").Router();
const { overwriteMiddlewareResult } = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middlewares = require("../utils/middlewares");

blogRouter.get("/", async (request, response) => {
  let blogs = await Blog.find({}).populate("user", { username: 1 });

  return response.json(
    blogs.forEach((blog) => (blog.author = blog.user.username))
  );
});
blogRouter.post(
  "/",
  middlewares.userExtractor,
  async (request, response, next) => {
    //Checks if the user is logged by decoding the token and checking it against the secret
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: "Unauthorized" });
    }
    console.log(user);
    const newBlog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user.id,
    });
    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    return response.status(201).json(savedBlog);
  }
);
blogRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    return response.status(404).end();
  }
});
blogRouter.delete(
  "/:id",
  middlewares.userExtractor,
  async (request, response, next) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);
    if (!user.id || !user) {
      return response.status(400).json({ error: "The token is invalid" });
    }
    if (user.id.toString() !== blog.user.toString()) {
      return response
        .status(400)
        .json({ error: "The blog is not posted by the user." });
    }
    await Blog.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  }
);

module.exports = blogRouter;
