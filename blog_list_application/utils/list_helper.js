const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  return blogs.reduce((accumalator, blog) => accumalator + blog.likes, 0);
};
const favoriteBlog = (blogs) => {
  let mostLiked = Math.max(...blogs.map((blog) => blog.likes));
  return blogs.filter((blog) => blog.likes === mostLiked)[0];
};
const mostBlogs = (blogs) => {};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
