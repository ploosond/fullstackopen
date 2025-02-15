import { useDispatch, useSelector } from 'react-redux';
import {
  updateLikes,
  deleteBlog,
  addNewComment,
} from '../reducers/blogsReducer';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

const Blog = () => {
  const naviagte = useNavigate();
  const [comment, setComment] = useState('');
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

  const handleComment = async (event) => {
    event.preventDefault();
    dispatch(addNewComment(blog, { comment }));
    setComment('');
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(deleteBlog(blog));
        naviagte('/');
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
      <h2>blog app</h2>
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
      <h4>comments</h4>
      <form onSubmit={handleComment}>
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button>add comment</button>
      </form>

      <ul>
        {blog.comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
