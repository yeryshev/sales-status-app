import { ReduxStoreWithManager, StateSchema, ThunkConfig } from './config/StateSchema';
import { AppDispatch, createReduxStore } from './config/store';
import { StoreProvider } from './ui/StoreProvider';

export {
  StoreProvider,
  createReduxStore,
  type StateSchema,
  type AppDispatch,
  type ReduxStoreWithManager,
  type ThunkConfig,
};
