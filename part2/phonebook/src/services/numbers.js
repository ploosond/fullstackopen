import axios from "axios"
const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

const deletedUser = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

const capitalizeWords = (name) => {
  return name
    .split(" ")
    .map((n) => n[0].toUpperCase().concat(n.slice(1)))
    .join(" ")
}

export default { getAll, create, update, deletedUser, capitalizeWords }
