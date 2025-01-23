const blogRouter = require("express").Router();
const Blog = require("../models/blog");
blogRouter.get("/", async (request, response) => {
  let blogs = await Blog.find({});
  response.json(blogs);
});
blogRouter.post("/", async (request, response, next) => {
  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  });
  try {
    const savedBlog = await newBlog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});
blogRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});
blogRouter.get("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
