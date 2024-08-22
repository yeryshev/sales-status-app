import { describe, test } from 'vitest';
import { componentRender } from '@/shared/lib/tests/componentRender/componentRender';
import AppRouter from './AppRouter';
import { RoutePath } from '@/shared/const/router';
import { screen } from '@testing-library/react';

describe('app/providers/router/ui/AppRouter', function () {
  test('Should render correctly', async () => {
    componentRender(<AppRouter />, {
      route: RoutePath.login,
    });

    const page = await screen.findByTestId('login-page');
    expect(page).toBeInTheDocument();
  });

  test('Page not found', async () => {
    componentRender(<AppRouter />, {
      route: '/nonexistent-route',
    });

    const page = await screen.findByTestId('not-found-page');
    expect(page).toBeInTheDocument();
  });

  test('Redirect an unauthorized user to the login page', async () => {
    componentRender(<AppRouter />, {
      route: RoutePath.main,
    });

    const page = await screen.findByTestId('login-page');
    expect(page).toBeInTheDocument();
  });

  test('Authorized user is redirected to the main page', async () => {
    componentRender(<AppRouter />, {
      route: RoutePath.main,
      initialState: { user: { data: { id: 1 }, mounted: true } },
    });

    const page = await screen.findByTestId('main-page');
    expect(page).toBeInTheDocument();
  });
});
