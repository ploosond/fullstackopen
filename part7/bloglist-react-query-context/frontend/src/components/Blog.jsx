import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { update, remove } from '../services/blogs';
import PropTypes from 'prop-types';

const Blog = ({ user, blog }) => {
  const [blogView, setBlogView] = useState(false);

  const showWhenVisible = { display: blogView ? 'none' : '' };
  const hideWhenVisible = { display: blogView ? '' : 'none' };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleView = () => {
    setBlogView(!blogView);
  };

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

  const handleLike = async () => {
    try {
      await updateBlogMutation.mutate({
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await deleteBlogMutation.mutate(blog);
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
  };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible} className="defaultDiv">
        {blog.title} {blog.author} <button onClick={toggleView}>view</button>
      </div>
      <div style={hideWhenVisible} className="toggledDiv">
        {blog.title} {blog.author} <button onClick={toggleView}>hide</button>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{blog?.user?.name}</p>
        {blog?.user?.name === user?.name && (
          <button className="remove" onClick={handleRemove}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
