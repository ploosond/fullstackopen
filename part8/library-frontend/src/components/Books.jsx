import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = () => {
  const [show, setShow] = useState(true);
  const [genre, setGenre] = useState(null);
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (loading) {
    return <div>loading...</div>;
  }

  const genres = data.allBooks
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

  const books = show
    ? data.allBooks
    : data.allBooks.filter((b) => b.genres.includes(genre));

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
          {books.map((a) => (
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
