import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    createNotification(state, action) {
      return action.payload;
    },
    removeNotification(state, action) {
      return "";
    },
  },
});

export const setNotification = (text, timer) => {
  return (dispatch) => {
    dispatch(createNotification(text));
    setTimeout(() => {
      dispatch(removeNotification());
    }, timer * 1000);
  };
};

export const { createNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
