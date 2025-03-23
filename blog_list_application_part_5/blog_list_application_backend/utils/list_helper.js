const _ = require("lodash");
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

const mostBlogs = (blogs) => {
  //  ===== My Solution =======
  /*   const authors = blogs.map((blog) => blog.author);
  function countOccurances(array, author) {
    return array.reduce(
      (count, current) => (current === author ? count + 1 : count + 0),
      0
    );
  }
  const authorsAndRepetitions = authors.map((author, index, array) => ({
    author,
    blogs: countOccurances(array, author),
  }));
  let blogCounts = authorsAndRepetitions.map((author) => author.blogs);
  return authorsAndRepetitions.filter(
    (author) => author.blogs === Math.max(...blogCounts)
  )[0]; */
  // ===== My Solution =======

  // ====Functional solution ====
  /* const authorCounts = blogs.reduce((acc, blog) => {
    acc.set(blog.author, (acc.get(blog.author) || 0) + 1);
    return acc;
  }, new Map());
  return [...authorCounts.entries()].reduce(
    (max, [author, blogs]) => (blogs > max.blogs ? { author, blogs } : max),
    { author: null, blogs: 0 }
  ); */
  // ====Functional solution ====

  //Lodash Solution
  const authorCounts = _.countBy(blogs, "author");
  const maxBlogAuthor = _.maxBy(
    Object.entries(authorCounts),
    ([author, count]) => count
  );
  return maxBlogAuthor
    ? { author: maxBlogAuthor[0], blogs: maxBlogAuthor[1] }
    : { author: null, blogs: 0 };

  //Lodash solution
};
function mostLikes(blogs) {
  // =========My Solution ==========
  /*   const authorLikes = blogs.reduce((acc, blog) => {
    if (!acc[blog.author]) {
      acc[blog.author] = 0;
    }
    acc[blog.author] += blog.likes;
    return acc;
  }, {});
  return Object.entries(authorLikes).reduce(
    (mostLiked, [author, likes]) =>
      likes > mostLiked.likes ? { author, likes } : mostLiked,
    { author: null, likes: 0 }
  ); */
  // ======== My Solution ===========

  //=======Lodash========
  const likeByAuthor = _(blogs)
    .groupBy("author")
    .mapValues((blogs) => _.sumBy(blogs, "likes"))
    .value();
  const mostLiked = _.maxBy(Object.entries(likeByAuthor), ([, likes]) => likes);
  return mostLiked
    ? { author: mostLiked[0], likes: mostLiked[1] }
    : { author: null, likes: 0 };

  //=======Lodash========
}
mostLikes([
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
]);
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
