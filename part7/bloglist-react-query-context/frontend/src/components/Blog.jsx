import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ user, blog, handleUpdateBlog, handleRemoveBlog }) => {
  const [blogView, setBlogView] = useState(false);

  const showWhenVisible = { display: blogView ? 'none' : '' };
  const hideWhenVisible = { display: blogView ? '' : 'none' };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleView = () => {
    setBlogView(!blogView);
  };

  const handleLike = () => {
    handleUpdateBlog({
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    });
  };

  const handleRemove = () => {
    handleRemoveBlog({ ...blog });
  };

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleUpdateBlog: PropTypes.func.isRequired,
    handleRemoveBlog: PropTypes.func.isRequired,
  };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible} className="defaultDiv">
        {blog.title} {blog.author} <button onClick={toggleView}>view</button>
      </div>
      <div style={hideWhenVisible} className="toggledDiv">
        {blog.title} {blog.author} <button onClick={toggleView}>hide</button>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{blog?.user?.name}</p>
        {blog?.user?.name === user?.name && (
          <button className="remove" onClick={handleRemove}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
