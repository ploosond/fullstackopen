import { useQuery } from "@apollo/client";
import EditAuthor from "./EditAuthor";

const Authors = ({ authors }) => {
  if (authors.loading) {
    return <div>loading...</div>;
  }

  if (authors.error) {
    return null;
  }

  const showAuthors = authors.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {showAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor authors={authors.data.allAuthors} />
    </div>
  );
};

export default Authors;
