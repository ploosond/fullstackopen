import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
  updateLikes,
  deleteBlog,
  addNewComment,
} from '../reducers/blogsReducer';
import {
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

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
    <Paper elevation={2} sx={{ padding: '1em' }}>
      <Typography variant="h4">
        {blog.title} {blog.author}
      </Typography>
      <Typography variant="h6">{blog.url}</Typography>
      <Typography variant="h6">
        {`${blog.likes} `}
        <Button size="small" variant="contained" onClick={handleLike}>
          likes
        </Button>
      </Typography>
      <Typography variant="h5">
        added by {blog.user !== null && blog.user.name}
      </Typography>
      {blog.user.name === user.name && (
        <Button
          size="small"
          variant="contained"
          color="warning"
          className="remove"
          onClick={handleRemove}
        >
          remove
        </Button>
      )}
      <Typography sx={{ marginTop: '0.5em' }} variant="h4">
        comments
      </Typography>
      <Box
        component="form"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        onSubmit={handleComment}
      >
        <TextField
          size="small"
          variant="outlined"
          label="Add comment here..."
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button size="small" variant="contained" onClick={handleComment}>
          add comment
        </Button>
      </Box>

      <List>
        {blog.comments.map((comment, i) => (
          <ListItem key={i}>
            <ListItemText>{comment}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Blog;
