import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import Togglable from './Togglable';
import BlogForm from './BlogForm';
import Blogs from './Blogs';
import Notification from './Notification';
import { createNotification } from '../reducers/notificationsReducer';
import { createBlog } from '../reducers/blogsReducer';

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
      <Notification />
      <Blogs />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
    </div>
  );
};

export default Home;
