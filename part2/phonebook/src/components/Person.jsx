const Person = ({ person, handleDelete }) => {
  const updatedName = person.name
    .split(" ")
    .map((n) => n[0].toUpperCase().concat(n.slice(1)))
    .join(" ")
  return (
    <p>
      {`${updatedName} ${person.number} `}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </p>
  )
}

export default Person
