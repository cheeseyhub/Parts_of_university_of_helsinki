import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogsForm from "./components/BlogsForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  //Login credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  //New Blog properties
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("LoggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await loginService.Login({
        username,
        password,
      });
      blogService.setToken(user.token);
      setUser(user);
      setSuccessMessage(`${username} has logged in.`);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("LoggedBlogUser", JSON.stringify(user));
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }
  async function handleCreatingBlog(event, title, author, url) {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({ title, author, url });
      setSuccessMessage(`A new blog ${title} of ${author} has been added.`);
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.response.data.error}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }
  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  //loginForm
  //logout
  return user === null ? (
    <LoginForm
      handleLogin={handleLogin}
      password={password}
      username={username}
      setPassword={setPassword}
      setUsername={setUsername}
    />
  ) : (
    <BlogsForm
      user={user}
      successMessage={successMessage}
      errorMessage={errorMessage}
      blogs={blogs}
      handleCreatingBlog={handleCreatingBlog}
      blogFormRef={blogFormRef}
    />
  );
};

export default App;
