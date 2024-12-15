import { useState } from 'react'

const Blog = ({ blog }) => {
  const [blogView, setBlogView] = useState(false)

  const showWhenVisible = { display: blogView ? 'none' : '' }
  const hideWhenVisible = { display: blogView ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleView = () => {
    setBlogView(!blogView)
  }

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleView}>view</button>
      </div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleView}>hide</button>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button>like</button>
        </p>
        <p>{blog.author}</p>
      </div>
    </div>
  )
}

export default Blog
