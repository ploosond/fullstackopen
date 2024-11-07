import React from "react"

const Form = ({ addName, handleName, newName, handleNumber, newNumber }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input onChange={handleName} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumber} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Form
