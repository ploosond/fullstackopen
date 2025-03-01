const Favorite = ({ user, books }) => {
  if (user.loading) {
    return <p>Loading...</p>;
  }
  if (books.loading) {
    return <p>Loading...</p>;
  }

  if (user.error) {
    return <p>Error {user.error.message}</p>;
  }
  if (books.error) {
    return <p>Error {books.error.message}</p>;
  }

  const favoriteGenre = user ? user.data?.me.favoriteGenre : null;

  const favoriteBooks = books.data?.allBooks.filter((b) =>
    b.genres.includes(favoriteGenre)
  );

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>{" "}
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoriteBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Favorite;
