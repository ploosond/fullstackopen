import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    createNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    },
  },
});

export const setNotification = (text, timer) => {
  return (dispatch) => {
    dispatch(createNotification(text));
    setTimeout(() => {
      dispatch(clearNotification());
    }, timer * 1000);
  };
};

export const { createNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
