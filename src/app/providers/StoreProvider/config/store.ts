import teamReducer from '@/entities/team/model/slice/teamSlice';
import userReducer from '@/entities/user/model/slice/userSlice';
import commentsReducer from '@/entities/comments/model/slice/commentsSlice';
import { statusReducer } from '@/entities/Status';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from './RootState';
import { useDispatch } from 'react-redux';

export function createReduxStore(initialState?: RootState) {
    return configureStore({
        reducer: {
            user: userReducer,
            team: teamReducer,
            status: statusReducer,
            comments: commentsReducer,
        },
        devTools: import.meta.env.DEV,
        preloadedState: initialState,
    });
}

const store = createReduxStore();
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
