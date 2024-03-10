import { Dashboard } from '@/pages/Dashboard';
import { LoginPage } from '@/features/AuthByEmail';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import RequireAuth from '@/shared/RequireAuth';
import { type RouteProps } from 'react-router-dom';

export enum AppRoutes {
    MAIN = 'main',
    PROFILE = 'profile',
    LOGIN = 'login',
    NOT_FOUND = 'error',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.PROFILE]: '/profile',
    [AppRoutes.LOGIN]: '/auth/login',
    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: (
            <RequireAuth>
                <Dashboard />
            </RequireAuth>
        ),
    },
    [AppRoutes.PROFILE]: {
        path: RoutePath.profile,
        element: (
            <RequireAuth>
                <ProfilePage />
            </RequireAuth>
        ),
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element: <LoginPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.error,
        element: <NotFoundPage />,
    },
};
