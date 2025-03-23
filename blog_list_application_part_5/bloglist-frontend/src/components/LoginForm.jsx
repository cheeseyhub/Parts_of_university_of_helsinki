import PropTypes from "prop-types";
const LoginForm = ({
  errorMessage,
  handleLogin,
  setUsername,
  setPassword,
  username,
  password,
}) => {
  return (
    <section>
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

      <form onSubmit={handleLogin}>
        <h1>Login Form</h1>
        <article>
          <label htmlFor="username">Username</label>&nbsp;
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            placeholder="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </article>
        <br />
        <article>
          <label htmlFor="password">Password</label>&nbsp;
          <input
            type="text"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </article>
        <br />
        <button type="submit">Login</button>
      </form>
    </section>
  );
};
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;
