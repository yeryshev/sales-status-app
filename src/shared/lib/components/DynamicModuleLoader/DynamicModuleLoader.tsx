import { FC, ReactNode, useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { ReduxStoreWithManager, StateSchemaKey } from '@/app/providers/StoreProvider/config/StateSchema';
import { Reducer } from '@reduxjs/toolkit';

export type ReducersList = {
  [name in StateSchemaKey]?: Reducer;
}

interface DynamicModuleLoaderProps {
  children: ReactNode;
  reducers: ReducersList;
  removeAfterUnmount?: boolean;
}

export const DynamicModuleLoader: FC<DynamicModuleLoaderProps> = (props) => {
    const {
        children,
        reducers,
        removeAfterUnmount,
    } = props;

    const store = useStore() as ReduxStoreWithManager;
    const dispatch = useDispatch();

    useEffect(() => {
        Object.entries(reducers).forEach(([name, reducer]) => {
            const key = name as StateSchemaKey;
            if (reducer) {
                store.reducerManager.add(key, reducer);
                dispatch({ type: `@INIT ${key} reducer` });
            }
        });

        return () => {
            if (removeAfterUnmount) {
                Object.entries(reducers).forEach(([name]) => {
                    const key = name as StateSchemaKey;
                    store.reducerManager.remove(key);
                    dispatch({ type: `@DESTROY ${key} reducer` });
                });
            }
        };
    }, []);

    return (
        <>
            {children}
        </>
    );
};
