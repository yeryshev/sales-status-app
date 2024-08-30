import { describe, expect, test } from 'vitest';
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
});
