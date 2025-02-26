import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../queries";
import { useNavigate } from "react-router";

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { data, loading, error }] = useMutation(LOGIN);

  const submit = async (event) => {
    event.preventDefault();

    await login({
      variables: {
        username,
        password,
      },
    });
    navigate("/");
  };

  useEffect(() => {
    if (data) {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
    }
  }, [data]);

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
