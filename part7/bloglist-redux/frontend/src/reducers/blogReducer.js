import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'newBlog',
  initialState: {
    title: '',
    author: '',
    url: '',
  },

  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setAuthor: (state, action) => {
      state.author = action.payload;
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    reset: (state, action) => {
      state.title = '';
      state.author = '';
      state.url = '';
    },
  },
});

export const { setTitle, setAuthor, setUrl, reset } = blogSlice.actions;
export default blogSlice.reducer;
