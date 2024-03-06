import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeepPartial } from '@reduxjs/toolkit';
import { RootState, StoreProvider } from '@/app/providers/StoreProvider';

export interface componentRenderOptions {
    route?: string;
    initialState?: DeepPartial<RootState>;
}

export function componentRender(component: ReactNode, options: componentRenderOptions = {}) {
    const { route = '/', initialState } = options;

    return render(
        <StoreProvider initialState={initialState}>
            <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>
        </StoreProvider>
    );
}
