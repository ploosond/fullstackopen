import { useState } from "react";

const Books = ({ books }) => {
  const [show, setShow] = useState(true);
  const [genre, setGenre] = useState(null);

  if (books.loading) {
    return <div>loading...</div>;
  }

  if (books.error) {
    return null;
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

  const showBooks = show
    ? books.data.allBooks
    : books.data.allBooks.filter((b) => b.genres.includes(genre));

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
