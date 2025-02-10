import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, type: null },
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotification: (state, action) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const createNotification = (object, timer) => {
  return (dispatch) => {
    dispatch(setNotification(object));
    setTimeout(() => {
      dispatch(clearNotification());
    }, timer * 1000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
