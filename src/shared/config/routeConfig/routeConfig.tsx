import { MainPage } from 'src/pages/MainPage';
import { LoginPage } from '@/features/AuthByEmail';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { type RouteProps } from 'react-router-dom';
import { TelegramChatsPage } from '@/pages/TelegramChatsPage';

export type AppRouteProps = RouteProps & {
  authOnly?: boolean;
};

export enum AppRoutes {
  MAIN = 'main',
  ACCOUNT_MANAGERS = 'accountManagers',
  TELEGRAM_CHATS = 'telegramChats',
  PROFILE = 'profile',
  LOGIN = 'login',
  NOT_FOUND = 'error',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.ACCOUNT_MANAGERS]: '/account-managers',
  [AppRoutes.TELEGRAM_CHATS]: '/telegram-chats',
  [AppRoutes.PROFILE]: '/profile',
  [AppRoutes.LOGIN]: '/auth/login',
  [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
    authOnly: true,
  },
  [AppRoutes.ACCOUNT_MANAGERS]: {
    path: RoutePath.accountManagers,
    element: <MainPage />,
    authOnly: true,
  },
  [AppRoutes.TELEGRAM_CHATS]: {
    path: RoutePath.telegramChats,
    element: <TelegramChatsPage />,
    authOnly: true,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePath.profile,
    element: <ProfilePage />,
    authOnly: true,
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
