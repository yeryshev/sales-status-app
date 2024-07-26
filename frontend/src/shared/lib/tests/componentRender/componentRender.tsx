import { StateSchema, StoreProvider } from '@/app/providers/StoreProvider';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ReducersMapObject } from '@reduxjs/toolkit';

export interface componentRenderOptions {
  route?: string;
  initialState?: DeepPartial<StateSchema>;
  asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
}

export function componentRender(component: ReactNode, options: componentRenderOptions = {}) {
  const { route = '/', initialState, asyncReducers } = options;

  return render(
    <MemoryRouter initialEntries={[route]}>
      <StoreProvider initialState={initialState} asyncReducers={asyncReducers}>
        {component}
      </StoreProvider>
    </MemoryRouter>,
  );
}
