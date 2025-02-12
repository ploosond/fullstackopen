import { useContext } from 'react';
import { useBlogDispatch, useBlogValue } from '../context/BlogContext';

const BlogForm = ({ handleNewBlog }) => {
  const blog = useBlogValue();
  const blogDispatch = useBlogDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    handleNewBlog(blog);
    blogDispatch({ type: 'RESET' });
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
            onChange={({ target }) =>
              blogDispatch({
                type: 'SET',
                payload: { ...blog, title: target.value },
              })
            }
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
            onChange={({ target }) =>
              blogDispatch({
                type: 'SET',
                payload: { ...blog, author: target.value },
              })
            }
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
            onChange={({ target }) =>
              blogDispatch({
                type: 'SET',
                payload: { ...blog, url: target.value },
              })
            }
            placeholder="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
