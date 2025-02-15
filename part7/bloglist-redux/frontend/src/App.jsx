import { useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useMatch,
  useNavigate,
} from 'react-router';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useSelector, useDispatch } from 'react-redux';
import { createNotification } from './reducers/notificationsReducer';
import { createBlog, initializeBlogs } from './reducers/blogsReducer';
import { username, password, reset } from './reducers/loginReducer';
import { setUser, clearUser } from './reducers/userReducer';
import './App.css';
import { initializeUsers } from './reducers/usersReducer';

const LoginForm = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const login = useSelector((state) => state.login);
  const naviagte = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login(login);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));
      dispatch(reset());
      naviagte('/');
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
    <div>
      <h2>Log in to application</h2>
      {notification.type === 'error' && (
        <p className="error">{notification.message}</p>
      )}
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            name="Username"
            value={login.username}
            onChange={(e) => dispatch(username(e.target.value))}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="text"
            name="Password"
            value={login.password}
            onChange={(e) => dispatch(password(e.target.value))}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <div style={blogStyle}>{blog.title}</div>
          </Link>
        ))}
    </div>
  );
};

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  return (
    <div>
      {notification.type === 'success' && (
        <p className="success">{notification.message}</p>
      )}
      {notification.type === 'error' && (
        <p className="error">{notification.message}</p>
      )}
    </div>
  );
};

const Users = () => {
  const users = useSelector((state) => state.users);

  return (
    <div>
      <h2>blog app</h2>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const User = () => {
  const id = useParams().id;
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  );

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>blog app</h2>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title} </li>
        ))}
      </ul>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  const handleNewBlog = async (blogObject) => {
    try {
      await dispatch(createBlog(blogObject));

      dispatch(
        createNotification(
          {
            message: `a  new blog ${blogObject.title} by ${blogObject.author}`,
            type: 'success',
          },
          3
        )
      );
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      dispatch(
        createNotification(
          { message: 'fail to add a  new blog', type: 'error' },
          3
        )
      );
      console.log(exception);
    }
  };

  return (
    <div>
      <h2>blog app</h2>
      <Notification />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
      <Blogs />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const naviagte = useNavigate();

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
  }, [dispatch]);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearUser());
    naviagte('/login');
  };

  const padding = {
    padding: 3,
  };

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <div>
      <nav>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="users">
          users
        </Link>
        {user ? (
          `${user.name} logged in `
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
        <button onClick={handleLogout}>logout</button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;
