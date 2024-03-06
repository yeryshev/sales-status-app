import { teamReducer } from '@/entities/Teammate';
import { userReducer } from '@/entities/User';
import { commentsReducer } from '@/entities/Comment/model/slice/commentsSlice';
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
