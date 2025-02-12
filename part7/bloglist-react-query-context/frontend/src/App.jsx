import { useEffect, useRef, useContext } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useLoginDispatch, useLoginValue } from './context/LoginContext';
import UserContext, {
  useUserDispatch,
  useUserValue,
} from './context/UserContext';
import NotificationContext, {
  useNotificationDispatch,
  useNotificationValue,
} from './context/NotificationContext';
import { userLogin } from './services/login';
import { setToken, getAll, create, update, remove } from './services/blogs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from './services/users';
import './App.css';

const LoginForm = () => {
  const notification = useNotificationValue();
  const notificationDispatch = useNotificationDispatch();
  const login = useLoginValue();
  const loginDispatch = useLoginDispatch();
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await userLogin(login);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      setToken(user.token);
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
};

const Blogs = () => {
  const user = useUserValue();
  const { isLoading, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    initialData: [],
  });

  const blogs = data;

  const queryClient = useQueryClient();
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
  return (
    <div>
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

const Notification = () => {
  const notification = useNotificationValue();
  return (
    <div>
      {notification?.type === 'success' && (
        <p className="success">{notification?.message}</p>
      )}
      {notification?.type === 'error' && (
        <p className="error">{notification?.message}</p>
      )}
    </div>
  );
};

const User = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData: [],
  });

  const users = data;

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    userDispatch({ type: 'REMOVE' });
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET', payload: user });
      setToken(user.token);
    }
  }, [userDispatch]);

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        {users.map((user) => (
          <tbody key={user.id}>
            <tr>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();

  const blogFormRef = useRef();

  const queryClient = useQueryClient();

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

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <div>
      <Notification />
      <User />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
      <Blogs />
    </div>
  );
};

export default App;
