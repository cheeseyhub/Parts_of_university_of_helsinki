const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);
const helper = require("./test_helper");
const initialBlogs = helper.initialBlogs;

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});
test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});
test.only("There are blogs", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});
test("A valid blog can be added", async () => {
  const newBlog = {
    title: "The is an async/await blog post.",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
  const contents = blogsAtEnd;
  assert(contents.includes("The is an async/await blog post."));
});
test("Blog without content is not added", async () => {
  const newBlog = {
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
});

test("The first blog is about HTTP methods ", async () => {
  const response = await api.get("/api/blogs");

  const contents = response.body.map((e) => e.title);
  assert.strictEqual(contents.includes("HTML is easy."), true);
});

after(async () => {
  await mongoose.connection.close();
});
