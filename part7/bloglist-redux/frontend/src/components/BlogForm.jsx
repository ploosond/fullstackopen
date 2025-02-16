import { useDispatch, useSelector } from 'react-redux';
import { setTitle, setAuthor, setUrl, reset } from '../reducers/blogReducer';
import { Box, TextField, Button, Grid, Stack } from '@mui/material';
const BlogForm = ({ handleNewBlog }) => {
  const dispatch = useDispatch();

  const blog = useSelector((state) => state.blog);

  const addBlog = (event) => {
    event.preventDefault();
    handleNewBlog(blog);
    dispatch(reset());
  };

  return (
    <Box
      component="form"
      sx={{
        maxWidth: '100%',
      }}
      onSubmit={addBlog}
    >
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Title"
            variant="outlined"
            data-testid="title"
            type="text"
            name="title"
            value={blog.title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="title"
          />

          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Author"
            variant="outlined"
            data-testid="author"
            type="text"
            name="author"
            value={blog.author}
            onChange={(e) => dispatch(setAuthor(e.target.value))}
            placeholder="author"
          />
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Url"
            variant="outlined"
            data-testid="url"
            type="text"
            name="url"
            value={blog.url}
            onChange={(e) => dispatch(setUrl(e.target.value))}
            placeholder="url"
          />
        </Grid>
      </Grid>
      <Button size="small" variant="contained" color="primary" type="submit">
        create
      </Button>
    </Box>
  );
};

export default BlogForm;
