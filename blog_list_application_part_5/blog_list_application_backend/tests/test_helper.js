let Blog = require("../models/blog.js");
let User = require("../models/user.js");

let initialBlogs = [
  {
    title: "HTML is easy.",
  },
  {
    title: "Browser can only execute javascript.",
  },
];

const nonExistingId = async () => {
  const newBlog = new Blog({ title: "willremovethissoon" });
  await newBlog.save();
  await newBlog.deleteOne();

  return newBlog.id.toString();
};
const blogsInDB = async () => {
  let blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};
const usersInDb = async () => {
  let users = await User.find({});
  console.log(usersInDb);
  return users;
};
module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDB,
  usersInDb,
};
