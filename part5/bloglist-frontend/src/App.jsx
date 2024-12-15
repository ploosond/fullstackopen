import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)

      setBlogs(blogs.concat(blog))
      setSuccessMessage(
        `a  new blog ${blogObject.title} by ${blogObject.author}`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setErrorMessage('fail to add a  new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      console.log(exception)
    }
  }

  const handleUpdateBlog = async (newObject) => {
    try {
      const updatedBlog = await blogService.update(newObject.id, newObject)
      setBlogs(
        blogs.map((blog) => (blog.id === newObject.id ? updatedBlog : blog))
      )
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleRemoveBlog = async (newObject) => {
    if (
      window.confirm(`Remove blog ${newObject.title} by ${newObject.author}`)
    ) {
      try {
        await blogService.remove(newObject.id)
        setBlogs(blogs.filter((blog) => blog.id !== newObject.id))
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              name="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="text"
              name="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleUpdateBlog={handleUpdateBlog}
            handleRemoveBlog={handleRemoveBlog}
          />
        ))}
    </div>
  )
}

export default App
