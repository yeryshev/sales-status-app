import { StateSchema } from './config/StateSchema';
import { createReduxStore, RootState, AppDispatch, useAppDispatch } from './config/store';
import { StoreProvider } from './ui/StoreProvider';

export {
    StoreProvider,
    createReduxStore,
    type StateSchema,
    type RootState,
    type AppDispatch,
    useAppDispatch,
};
