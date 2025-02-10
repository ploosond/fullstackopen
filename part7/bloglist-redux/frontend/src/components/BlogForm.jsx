import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle, setAuthor, setUrl, reset } from '../reducers/blogReducer';
const BlogForm = ({ handleNewBlog }) => {
  const dispatch = useDispatch();

  const blog = useSelector((state) => state.blog);

  const addBlog = (event) => {
    event.preventDefault();
    handleNewBlog(blog);
    dispatch(reset());
  };

  BlogForm.propTypes = {
    handleNewBlog: PropTypes.func.isRequired,
  };
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
            value={blog.title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="title"
          />
        </div>
        <div>
          author
          <input
            data-testid="author"
            type="text"
            name="author"
            value={blog.author}
            onChange={(e) => dispatch(setAuthor(e.target.value))}
            placeholder="author"
          />
        </div>
        <div>
          url
          <input
            data-testid="url"
            type="text"
            name="url"
            value={blog.url}
            onChange={(e) => dispatch(setUrl(e.target.value))}
            placeholder="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
