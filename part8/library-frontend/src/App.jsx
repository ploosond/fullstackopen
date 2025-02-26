import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const navigate = useNavigate();
  const padding = {
    padding: "3px",
    margin: "1px",
    background: "#CAD4BF",
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/login");
  };

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          authors
        </Link>
        <Link style={padding} to="/books">
          books
        </Link>
        {token ? (
          <>
            <Link style={padding} to="/add">
              add book
            </Link>

            <button style={padding} onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>
      <Routes>
        <Route
          path="/"
          element={token ? <Authors /> : <Navigate replace to="/login" />}
        />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
      </Routes>
    </div>
  );
};

export default App;
