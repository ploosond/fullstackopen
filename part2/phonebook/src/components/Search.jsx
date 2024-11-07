import React from "react"

const Search = ({ handleFilter, search }) => {
  return (
    <div>
      filter shown with <input onChange={handleFilter} value={search} />
    </div>
  )
}

export default Search
