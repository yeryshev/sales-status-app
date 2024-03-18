import { commentsReducer } from '@/entities/Comment';
import { statusReducer } from '@/entities/Status';
import { teamReducer } from '@/entities/Teammate';
import { userReducer } from '@/entities/User';
import { configureStore, ReducersMapObject } from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema.ts';
import { createReducerManager } from './reducerManager';

export function createReduxStore(
    initialState?: StateSchema,
    asyncReducers?: ReducersMapObject<StateSchema>
) {
    const rootReducers: ReducersMapObject<StateSchema> = {
        ...asyncReducers,
        user: userReducer,
        team: teamReducer,
        status: statusReducer,
        comments: commentsReducer
    };

    const reducerManager = createReducerManager(rootReducers);

    const store = configureStore({
    // @ts-expect-error временно
        reducer: reducerManager.reduce,
        devTools: import.meta.env.DEV,
        preloadedState: initialState
    });

    // @ts-expect-error временно
    store.reducerManager = reducerManager;

    return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
