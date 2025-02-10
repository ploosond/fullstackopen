import { configureStore } from '@reduxjs/toolkit';
import blogsReducer from './reducers/blogsReducer';
import blogReducer from './reducers/blogReducer';
import loginReducer from './reducers/loginReducer';
import userReducer from './reducers/userReducer';
import notificationsReducer from './reducers/notificationsReducer';

export default configureStore({
  reducer: {
    blogs: blogsReducer,
    blog: blogReducer,
    login: loginReducer,
    user: userReducer,
    notification: notificationsReducer,
  },
});
