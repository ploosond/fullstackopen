import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const User = () => {
  const id = useParams().id;
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  );

  if (!user) {
    return null;
  }

  return (
    <Paper elevation={3} style={{ margin: '1em', padding: '1em' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom>
        Added blogs
      </Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default User;
