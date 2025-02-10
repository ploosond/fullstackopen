import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: { username: '', password: '' },
  reducers: {
    username: (state, action) => {
      state.username = action.payload;
    },
    password: (state, action) => {
      state.password = action.payload;
    },
    reset: (state, action) => {
      state.username = '';
      state.password = '';
    },
  },
});

export const { username, password, reset } = loginSlice.actions;
export default loginSlice.reducer;
