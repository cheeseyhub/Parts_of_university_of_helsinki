const blogRouter = require("express").Router();
const Blog = require("../models/blog");
blogRouter.get("/", async (request, response) => {
  let blogs = await Blog.find({});
  response.json(blogs);
});
blogRouter.post("/", (request, response, next) => {
  const newBlog = new Blog(request.body);
  newBlog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
