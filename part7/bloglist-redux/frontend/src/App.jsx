import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Home from './components/Home';
import User from './components/User';
import Users from './components/Users';
import Blog from './components/Blog';
import Notification from './components/Notification';
import { initializeBlogs } from './reducers/blogsReducer';
import { initializeUsers } from './reducers/usersReducer';
import blogService from './services/blogs';
import loginService from './services/login';
import { createNotification } from './reducers/notificationsReducer';
import { username, password, reset } from './reducers/loginReducer';
import { setUser } from './reducers/userReducer';
import Navbar from './components/Navbar';
import { Button, Container, TextField, Typography, Box } from '@mui/material';
import './App.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const credentials = useSelector((state) => state.login);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));
      dispatch(reset());
      navigate('/');
    } catch (exception) {
      dispatch(
        createNotification(
          {
            message: 'wrong username or password',
            type: 'error',
          },
          3
        )
      );
    }
  };
  return (
    <Container>
      <Typography variant="h4">Log in to application</Typography>
      <Notification />
      <Box component="form" onSubmit={handleLogin}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          autoFocus
          label="username"
          type="text"
          id="username"
          name="Username"
          value={credentials.username}
          onChange={(e) => dispatch(username(e.target.value))}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          autoFocus
          label="password"
          type="text"
          id="password"
          name="Password"
          value={credentials.password}
          onChange={(e) => dispatch(password(e.target.value))}
        />
        <Button fullWidth variant="contained" type="submit">
          login
        </Button>
      </Box>
    </Container>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return null;
  }

  return (
    <Container>
      <Navbar />
      <Typography
        variant="h2"
        component="h1"
        sx={{
          textTransform: 'uppercase',
          textAlign: 'center',
          fontWeight: 500,
          my: 1,
          fontSize: { xs: '1rem', sm: '2rem', md: '3rem' },
          color: 'primary.main',
        }}
      >
        Blog App
      </Typography>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Container>
  );
};

export default App;
