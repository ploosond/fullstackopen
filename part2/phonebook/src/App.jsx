import { useEffect, useState } from "react"
import Search from "./components/Search"
import Form from "./components/Form"
import Details from "./components/Details"
import Notification from "./components/Notification"
import numbersService from "./services/numbers"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState(null)

  useEffect(() => {
    numbersService
      .getAll()
      .then((initialResponse) => {
        setPersons(initialResponse)
      })
      .catch((error) => console.log(error))
  }, [])

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const addName = (event) => {
    event.preventDefault()
    const duplicate = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (duplicate) {
      if (duplicate.number !== newNumber) {
        if (
          window.confirm(
            `${duplicate.name} is already added to phonebook, repalce the old number with a new one?`
          )
        ) {
          const updatedDetail = {
            ...duplicate,
            number: newNumber,
          }

          numbersService
            .update(duplicate.id, updatedDetail)
            .then((response) => {
              setPersons(
                persons.map((p) => (p.id === duplicate.id ? response : p))
              )
              setNewName("")
              setNewNumber("")
            })
            .catch((error) => console.log(error))
        }
      } else {
        alert(`${newName} is already added to phonebook`)
      }
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    numbersService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        setMessage(
          `Added ${newName
            .split(" ")
            .map((n) => n[0].toUpperCase().concat(n.slice(1)))
            .join(" ")}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch((error) => console.log(error))
  }

  const handleDelete = (id) => {
    const deleteUser = persons.find((p) => p.id === id)
    if (window.confirm(`Delete ${deleteUser.name} ?`)) {
      numbersService
        .deletedUser(id)
        .then((returnedUser) => {
          setPersons(persons.filter((p) => p.id !== returnedUser.id))
        })
        .catch((error) => console.log(error))
    }
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
      <Notification message={message} />
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
      <Details handleDelete={handleDelete} filteredPersons={filteredPersons} />
    </div>
  )
}

export default App
