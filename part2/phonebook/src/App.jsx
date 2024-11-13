import { useEffect, useState } from "react"
import Search from "./components/Search"
import Form from "./components/Form"
import Details from "./components/Details"
import Notification from "./components/Notification"
import numbersService from "./services/numbers"
import ErrorNotification from "./components/ErrorNotification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
            `${numbersService.capitalizeWords(
              duplicate.name
            )} is already added to phonebook, repalce the old number with a new one?`
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
            .catch((error) => {
              console.log(error)
              setErrorMessage(
                `Information of ${numbersService.capitalizeWords(
                  newName
                )} has already been removed from server`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
        }
      } else {
        alert(`${newName} is already added to phonebook`)
      }
      return
    }

    const newPerson = {
      name: numbersService.capitalizeWords(newName),
      number: newNumber,
    }

    numbersService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        setMessage(`Added ${numbersService.capitalizeWords(newName)}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch((error) => console.log(error))
  }

  const handleDelete = (id) => {
    const deleteUser = persons.find((p) => p.id === id)
    if (
      window.confirm(
        `Delete ${numbersService.capitalizeWords(deleteUser.name)} ?`
      )
    ) {
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
      <ErrorNotification errorMessage={errorMessage} />
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
