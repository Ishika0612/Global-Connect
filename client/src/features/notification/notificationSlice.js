import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    items: [],
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      const exists = state.items.find(n => n._id === action.payload._id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },
    markAllRead: (state) => {
      state.items = state.items.map(n => ({ ...n, read: true }));
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;
