import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleNewBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  BlogForm.propTypes = {
    handleNewBlog: PropTypes.func.isRequired,
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            data-testid="title"
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title"
          />
        </div>
        <div>
          author
          <input
            data-testid="author"
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author"
          />
        </div>
        <div>
          url
          <input
            data-testid="url"
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
