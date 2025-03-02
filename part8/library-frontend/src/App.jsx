import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate, data } from "react-router";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import Favorite from "./components/Favorite";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, ME } from "./queries";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const user = useQuery(ME, {
    skip: !token,
  });
  const books = useQuery(ALL_BOOKS);
  const authors = useQuery(ALL_AUTHORS);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
    },
  });

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
            <Link style={padding} to="/favorite">
              recommend
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
          element={
            token ? (
              <Authors authors={authors} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/books" element={<Books books={books} />} />
        <Route path="/add" element={<NewBook />} />
        <Route
          path="/favorite"
          element={<Favorite user={user} books={books} />}
        />
      </Routes>
    </div>
  );
};

export default App;
