import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = ({ books }) => {
  const [show, setShow] = useState(true);
  const [genre, setGenre] = useState(null);

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (result.loading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error {result.error.message}</p>;
  }

  if (books.loading) {
    return <p>Loading...</p>;
  }

  if (books.error) {
    return <p>Error {result.error.message}</p>;
  }

  const genres = books.data.allBooks
    .map((b) => b.genres)
    .flat()
    .reduce(
      (accumulator, currentValue) =>
        accumulator.includes(currentValue)
          ? accumulator
          : [...accumulator, currentValue],
      []
    );

  const filter = ({ target }) => {
    setGenre(target.value);
    setShow(false);
  };

  const showBooks = show ? books.data.allBooks : result.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {showBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g, i) => (
        <button key={i} value={g} onClick={filter}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
