import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useSelector, useDispatch } from 'react-redux';
import { createNotification } from './reducers/notificationReducer';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const handleNewBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject);

      setBlogs(blogs.concat(blog));
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

  const handleUpdateBlog = async (newObject) => {
    try {
      const updatedBlog = await blogService.update(newObject.id, newObject);
      setBlogs(
        blogs.map((blog) => (blog.id === newObject.id ? updatedBlog : blog))
      );
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleRemoveBlog = async (newObject) => {
    if (
      window.confirm(`Remove blog ${newObject.title} by ${newObject.author}`)
    ) {
      try {
        await blogService.remove(newObject.id);
        setBlogs(blogs.filter((blog) => blog.id !== newObject.id));
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  if (user === null) {
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
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="text"
              name="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification.type === 'success' && (
        <p className="success">{notification.message}</p>
      )}
      {notification.type === 'error' && (
        <p className="error">{notification.message}</p>
      )}
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            user={user}
            key={blog.id}
            blog={blog}
            handleUpdateBlog={handleUpdateBlog}
            handleRemoveBlog={handleRemoveBlog}
          />
        ))}
    </div>
  );
};

export default App;
