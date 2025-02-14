import { useDispatch, useSelector } from 'react-redux';
import { updateLikes, deleteBlog } from '../reducers/blogsReducer';
import { useParams } from 'react-router';

const Blog = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const id = useParams().id;
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );

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

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>{blog.url}</div>
      <div>
        {blog.likes}
        <button onClick={handleLike}>likes</button>
      </div>
      <div>added by {blog.user !== null && blog.user.name}</div>
      {blog.user.name === user.name && (
        <button className="remove" onClick={handleRemove}>
          remove
        </button>
      )}
    </div>
  );
};

export default Blog;
