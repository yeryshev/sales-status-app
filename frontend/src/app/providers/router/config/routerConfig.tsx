import { MainPage } from '@/pages/MainPage';
import { TelegramChatsPage } from '@/pages/TelegramChatsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AppRoutes, RoutePath } from '@/shared/const/router';
import { AppRouteProps } from '@/shared/types/router';

export const routerConfig: Record<AppRoutes, AppRouteProps> = {
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
  [AppRoutes.REGISTER]: {
    path: RoutePath.register,
    element: <RegisterPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.error,
    element: <NotFoundPage />,
  },
};
