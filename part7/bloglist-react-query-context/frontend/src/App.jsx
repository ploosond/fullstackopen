import { useState, useEffect, useRef, useContext } from 'react';
import Blog from './components/Blog';
import blogService, { create, remove, update } from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import './App.css';
import NotificationContext from './context/NotificationContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAll } from './services/blogs';
import LoginContext from './context/LoginContext';
import UserContext from './context/UserContext';

const App = () => {
  const [user, userDispatch] = useContext(UserContext);
  console.log(user);

  const [notification, notificationDispatch] = useContext(NotificationContext);
  const [login, loginDispatch] = useContext(LoginContext);

  const blogFormRef = useRef();

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    initialData: [],
  });
  const blogs = data;

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (newblog) => {
      const oldBlogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(['blogs'], oldBlogs.concat(newblog));
    },
    onError: () => {
      notificationDispatch({
        type: 'SET',
        payload: { message: 'fail to add a  new blog', type: 'error' },
      });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' });
      }, 3000);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: (deletedBlog) => {
      const oldBlogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        oldBlogs.filter((b) => b.id !== deletedBlog.id)
      );
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login(login);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      userDispatch({ type: 'SET', payload: user });
      loginDispatch({ type: 'RESET' });
    } catch (exception) {
      console.log(exception);
      notificationDispatch({
        type: 'SET',
        payload: { message: 'wrong username or password', type: 'error' },
      });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' });
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    userDispatch({ type: 'REMOVE' });
  };

  const handleNewBlog = async (blogObject) => {
    try {
      await newBlogMutation.mutate(blogObject);

      notificationDispatch({
        type: 'SET',
        payload: {
          message: `a  new blog ${blogObject.title} by ${blogObject.author}`,
          type: 'success',
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' });
      }, 3000);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleUpdateBlog = async (newObject) => {
    try {
      await updateBlogMutation.mutate(newObject);
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleRemoveBlog = async (newObject) => {
    if (
      window.confirm(`Remove blog ${newObject.title} by ${newObject.author}`)
    ) {
      try {
        await deleteBlogMutation.mutate(newObject);
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>service not available due to problems in server</div>;
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification?.type === 'error' && (
          <p className="error">{notification?.message}</p>
        )}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              name="Username"
              value={login.username}
              onChange={(e) =>
                loginDispatch({
                  type: 'SET',
                  payload: { ...login, username: e.target.value },
                })
              }
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="text"
              name="Password"
              value={login.password}
              onChange={(e) =>
                loginDispatch({
                  type: 'SET',
                  payload: { ...login, password: e.target.value },
                })
              }
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
      {notification?.type === 'success' && (
        <p className="success">{notification?.message}</p>
      )}
      {notification?.type === 'error' && (
        <p className="error">{notification?.message}</p>
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
