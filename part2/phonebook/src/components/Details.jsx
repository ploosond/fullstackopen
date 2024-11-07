import React from "react"
import Person from "./Person"

const Details = ({ filteredPersons }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </div>
  )
}

export default Details
