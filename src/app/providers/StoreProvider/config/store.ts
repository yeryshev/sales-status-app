import { userReducer } from '@/entities/User';
import { statusReducer } from '@/entities/Status';
import { commentReducer } from '@/entities/Comment';
import { CombinedState, configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { StateSchema, ThunkExtraArg } from './StateSchema';
import { createReducerManager } from './reducerManager';
import { $api } from '@/shared/api/api';
import { rtkApi } from '@/shared/api/rtkApi';

export function createReduxStore(initialState?: StateSchema, asyncReducers?: ReducersMapObject<StateSchema>) {
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    user: userReducer,
    status: statusReducer,
    comments: commentReducer,
    [rtkApi.reducerPath]: rtkApi.reducer,
  };

  const reducerManager = createReducerManager(rootReducers);

  const extraArg: ThunkExtraArg = {
    api: $api,
  };

  const store = configureStore({
    reducer: reducerManager.reduce as Reducer<CombinedState<StateSchema>>,
    devTools: import.meta.env.DEV,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: extraArg,
        },
      }).concat(rtkApi.middleware);
    },
  });

  // @ts-expect-error временно
  store.reducerManager = reducerManager;

  return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
