import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      return action.payload;
    },
    appendBlog: (state, action) => {
      state.push(action.payload);
    },
    updateBlog: (state, action) => {
      return state.map((b) =>
        b.id !== action.payload.id ? b : action.payload
      );
    },
    filterBlog: (state, action) => {
      return state.filter((b) => b.id !== action.payload.id);
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (object) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(object);
    dispatch(appendBlog(newBlog));
  };
};

export const updateLikes = (object) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(object);
    dispatch(updateBlog(updatedBlog));
  };
};

export const addNewComment = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.appendComment(id, comment);
    dispatch(updateBlog(updatedBlog));
  };
};

export const deleteBlog = (object) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.remove(object);
    dispatch(filterBlog(deletedBlog));
  };
};

export const { appendBlog, setBlogs, updateBlog, filterBlog } =
  blogSlice.actions;

export default blogSlice.reducer;
