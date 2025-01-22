const blogRouter = require("express").Router();
const Blog = require("../models/blog");
blogRouter.get("/", async (request, response) => {
  let blogs = await Blog.find({});
  response.json(blogs);
});
blogRouter.post("/", (request, response) => {
  const newBlog = new Blog(request.body);
  newBlog
    .save()
    .then((result) => {
      console.log(result);
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
