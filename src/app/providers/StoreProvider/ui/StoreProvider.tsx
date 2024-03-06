import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { createReduxStore } from '../config/store';
import { RootState } from '../config/RootState';
import { DeepPartial } from 'redux';

interface StoreProviderProps {
    children: ReactNode;
    initialState?: DeepPartial<RootState>;
}

export const StoreProvider = (props: StoreProviderProps) => {
    const { children, initialState } = props;

    const store = createReduxStore(initialState as RootState);

    return <Provider store={store}>{children}</Provider>;
};
