import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const Users = () => {
  const users = useSelector((state) => state.users);

  if (!users) {
    return null;
  }

  return (
    <TableContainer component={Paper} style={{ margin: '1em' }}>
      <Typography variant="h4" component="h2" style={{ padding: '1em' }}>
        Users
      </Typography>
      <Table aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Blogs Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell align="right">{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
