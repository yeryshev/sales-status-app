import teamReducer from '@/entities/team/model/slice/teamSlice';
import userReducer from '@/entities/user/model/slice/userSlice';
import commentsReducer from '@/entities/comments/model/slice/commentsSlice';
import tasksReducer from '@/entities/tasks/model/slice/tasksSlice';
import { statusReducer } from '@/entities/Status';
import { configureStore } from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema';
import { useDispatch } from 'react-redux';

export function createReduxStore(initialState?: StateSchema) {
    return configureStore({
        reducer: {
            team: teamReducer,
            user: userReducer,
            comments: commentsReducer,
            tasks: tasksReducer,
            status: statusReducer,
        },
        devTools: import.meta.env.DEV,
        preloadedState: initialState,
    });
}

const store = createReduxStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
