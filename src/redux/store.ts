import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import teamReducer from '../features/team/slice/teamSlice';
import userReducer from '../features/user/slice/userSlice';
import commentsReducer from '../features/comments/slice/commentsSlice';
import tasksReducer from '../features/tasks/slice/tasksSlice';
import statusReducer from '../features/statuses/slice/statusSlice';

export const store = configureStore({
  reducer: {
    team: teamReducer,
    user: userReducer,
    comments: commentsReducer,
    tasks: tasksReducer,
    status: statusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
