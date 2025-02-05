const { test, after, before, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);
const helper = require("./test_helper");
const initialBlogs = helper.initialBlogs;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

let tokenOfTestUser = "";
before(async () => {
  await User.findOneAndDelete({ username: "testUser" });
  const testPassword = await bcrypt.hash("testPassword", 10);
  const testUser = new User({
    username: "testUser",
    password: testPassword,
  });
  await testUser.save();
  const result = await api
    .post("/api/login")
    .send({ username: "testUser", password: "testPassword" });
  tokenOfTestUser = result.body.token;
});
beforeEach(async () => {
  const testUser = await User.findOne({ username: "testUser" });
  await Blog.deleteMany({});
  let blogObject = new Blog({
    title: initialBlogs[0].title,
    user: testUser._id.toString(),
  });
  await blogObject.save();
  blogObject = new Blog({
    title: initialBlogs[1].title,
    user: testUser._id.toString(),
  });
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
    .set({ authorization: `Bearer ${tokenOfTestUser}` })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(titles.includes("The is an async/await blog post."));
});

test("Blog without content is not added", async () => {
  const newBlog = {
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set({ authorization: `Bearer ${tokenOfTestUser}` })
    .send(newBlog)
    .expect(400);
  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
});

test("The first blog is about HTTP methods ", async () => {
  const response = await api.get("/api/blogs");
  const contents = response.body.map((e) => e.title);
  assert.strictEqual(contents.includes("HTML is easy."), true);
});

test("A specific blog can be viewed", async () => {
  const blogAtStart = await helper.blogsInDB();
  const blogToView = blogAtStart[0];
  blogToView.user = blogToView.user.toString();
  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
  assert.deepStrictEqual(resultBlog.body, blogToView);
});

test("A blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDB();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ authorization: `Bearer ${tokenOfTestUser}` })
    .expect(204);
  const blogsAtEnd = await helper.blogsInDB();
  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(!titles.includes(blogToDelete.title));
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);
});
after(async () => {
  await mongoose.connection.close();
});
