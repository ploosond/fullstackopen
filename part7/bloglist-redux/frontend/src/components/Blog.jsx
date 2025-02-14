import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateLikes, deleteBlog } from '../reducers/blogsReducer';

const Blog = ({ user, blog }) => {
  const dispatch = useDispatch();
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

  const handleLike = async () => {
    try {
      await dispatch(
        updateLikes({ ...blog, user: blog.user.id, likes: blog.likes + 1 })
      );
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(deleteBlog(blog));
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
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
