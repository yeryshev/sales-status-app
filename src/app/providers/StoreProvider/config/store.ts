import { commentsReducer } from '@/entities/Comment';
import { statusReducer } from '@/entities/Status';
import { teamReducer } from '@/entities/Teammate';
import { userReducer } from '@/entities/User';
import { ReducersMapObject, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { StateSchema } from './StateSchema.ts';
import { loginReducer } from '@/features/AuthByEmail';

export function createReduxStore(initialState?: StateSchema) {
    const rootReducers: ReducersMapObject<StateSchema> = {
        user: userReducer,
        team: teamReducer,
        status: statusReducer,
        comments: commentsReducer,
        loginForm: loginReducer
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
