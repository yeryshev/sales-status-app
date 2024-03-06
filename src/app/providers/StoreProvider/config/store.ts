import teamReducer from '@/entities/team/model/slice/teamSlice';
import userReducer from '@/entities/Users/model/slice/userSlice';
import commentsReducer from '@/entities/comments/model/slice/commentsSlice';
import { statusReducer } from '@/entities/Status';
import { ReducersMapObject, configureStore } from '@reduxjs/toolkit';
import { RootState } from './RootState';
import { useDispatch } from 'react-redux';

export function createReduxStore(initialState?: RootState) {
    const rootReducers: ReducersMapObject<RootState> = {
        user: userReducer,
        team: teamReducer,
        status: statusReducer,
        comments: commentsReducer,
    };

    return configureStore({
        reducer: rootReducers,
        devTools: import.meta.env.DEV,
        preloadedState: initialState,
    });
}

const store = createReduxStore();
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
