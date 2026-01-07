import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import postReducer from '../features/post/postSlice';
import chatReducer from '../features/chat/chatSlice';
import jobReducer from '../features/job/jobSlice';
import notifReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    chat: chatReducer,
    job: jobReducer,
    notification: notifReducer
  },
});

export default store;