import Blog from "./Blog";
import Toggalable from "./Toggalable";
import blogService from "../services/blogs";
import { useState } from "react";

function logout() {
  window.localStorage.clear();
  window.location.reload();
}
/* Handle incrementingLike */
const incrementingLike = async (setBlogLikes, blogLikes, id, blog) => {
  const updatedBlog = { ...blog, likes: (blogLikes || 0) + 1 };
  delete updatedBlog.user;
  setBlogLikes((prevLikes) => prevLikes + 1);
  await blogService.update(id, { ...updatedBlog });
};

/* Handle incrementingLike */
const BlogsForm = ({
  successMessage,
  errorMessage,
  user,
  handleCreatingBlog,
  blogs,
  blogFormRef,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  return (
    <section>
      {/* sucess message display */}
      {successMessage && (
        <article>
          <h1
            className="message"
            style={{
              color: "green",
              backgroundColor: "lightgray",
              border: "2px solid green",
              padding: "15px",
            }}
          >
            {`${successMessage}`}
          </h1>
        </article>
      )}
      {/* Error message display */}
      {errorMessage && (
        <article>
          <h1
            style={{
              color: "red",
              backgroundColor: "lightgray",
              border: "2px solid red",
              padding: "15px",
            }}
          >
            {`${errorMessage}`}
          </h1>
        </article>
      )}
      <h1>Logged in {`${user.username}`}</h1>
      <button onClick={logout}>Logout</button>
      <h3>Create a new Blog</h3>
      <Toggalable buttonLabel="New Blog" ref={blogFormRef}>
        <form
          onSubmit={(event) => handleCreatingBlog(event, title, author, url)}
        >
          <section>
            <label htmlFor="title">
              Title: &nbsp;
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title for the blog"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </label>
          </section>
          <br />
          <section>
            <label htmlFor="author">
              author: &nbsp;
              <input
                type="text"
                name="author"
                id="title"
                placeholder="Author of the blog"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </label>
          </section>
          <br />
          <section>
            <label htmlFor="url">
              Url: &nbsp;
              <input
                type="text"
                name="url"
                id="title"
                placeholder="Url for the blog"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </label>
          </section>
          <br />
          <button type="submit">Create</button>
        </form>
      </Toggalable>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} incrementingLike={incrementingLike} />
      ))}
    </section>
  );
};
export default BlogsForm;
