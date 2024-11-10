import { useEffect, useState } from "react"
import axios from "axios"
import Search from "./components/Search"
import Form from "./components/Form"
import Details from "./components/Details"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data)
    })
  }, [])

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const addName = (event) => {
    event.preventDefault()
    const duplicate = persons.find((person) => person.name === newName)
    if (duplicate) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    axios
      .post("http://localhost:3001/persons", newPerson)
      .then((response) => {
        setPersons(persons.concat(response.data))
        setNewName("")
        setNewNumber("")
      })
      .catch((error) => {
        console.log(`Error: ${error}`)
      })
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
