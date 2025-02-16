import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <Paper elevation={3} style={{ marginTop: '1em' }}>
      <List>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <ListItem key={blog.id} component={Link} to={`/blogs/${blog.id}`}>
              <ListItemText primary={blog.title} />
            </ListItem>
          ))}
      </List>
    </Paper>
  );
};

export default Blogs;
