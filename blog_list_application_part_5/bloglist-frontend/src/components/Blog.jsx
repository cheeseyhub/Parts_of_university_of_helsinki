import { useState } from "react";
import blogService from "../services/blogs";

/*Handle Removing blogs function */
const handleRemoveBlog = async (blog) => {
  if (confirm(`Do you want to remove ${blog.title} blog`)) {
    await blogService.removeBlog(blog.id);
  }
};
/*Handle Removing blogs function */

const Blog = ({ blog, incrementingLike }) => {
  let [blogLikes, setBlogLikes] = useState(blog.likes);

  const [detailOfBlog, setDetailOfBlog] = useState(false);
  const blogStyle = {
    border: "2px solid black",
    padding: "1rem",
    margin: "0.5rem 0",
  };
  const checkAuthorization = () => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("LoggedBlogUser")
    ).username;
    if (blog.user.username === loggedInUser) {
      return true;
    }
    return false;
  };
  return (
    <div style={blogStyle} className="blog">
      {blog.title} {!detailOfBlog && <strong> {blog.author}</strong>}
      <button onClick={() => setDetailOfBlog(!detailOfBlog)}>
        {detailOfBlog ? "Hide" : "Show"}
      </button>
      {detailOfBlog && (
        <section>
          <strong>URL: &nbsp;</strong>
          <span>{blog.url}</span>
          <br />
          <strong>Likes:&nbsp;</strong>
          <span className="Likes">{blogLikes}</span>&nbsp;
          <button
            onClick={() => {
              incrementingLike(setBlogLikes, blogLikes, blog.id, blog);
            }}
          >
            Like
          </button>
          <br />
          <strong>Author: &nbsp;</strong>
          <span>{blog.author}</span>
          <br />
          <br />
          {checkAuthorization() && (
            <button
              onClick={() => handleRemoveBlog(blog)}
              style={{ padding: "0.2rem" }}
            >
              Remove
            </button>
          )}
        </section>
      )}
    </div>
  );
};

export default Blog;
