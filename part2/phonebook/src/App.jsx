import { useEffect, useState } from "react"
import axios from "axios"
import Search from "./components/Search"
import Form from "./components/Form"
import Details from "./components/Details"

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    console.log("effect")
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data)
    })
  }, [])

  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )
  // console.log(filteredPersons)

  const addName = (event) => {
    event.preventDefault()
    const duplicate = persons.find((person) => person.name === newName)
    // console.log(persons)
    // console.log(duplicate)
    if (duplicate) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(
      persons.concat({
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      })
    )
    setNewName("")
    setNewNumber("")
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Search handleFilter={handleFilter} search={search} />
      <h2>add a new</h2>
      <Form
        addName={addName}
        handleName={handleName}
        newName={newName}
        handleNumber={handleNumber}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Details filteredPersons={filteredPersons} />
    </div>
  )
}

export default App
