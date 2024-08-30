export enum AppRoutes {
  MAIN = 'main',
  ACCOUNT_MANAGERS = 'accountManagers',
  TELEGRAM_CHATS = 'telegramChats',
  PROFILE = 'profile',
  LOGIN = 'login',
  REGISTER = 'register',
  NOT_FOUND = 'error',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.ACCOUNT_MANAGERS]: '/account-managers',
  [AppRoutes.TELEGRAM_CHATS]: '/telegram-chats',
  [AppRoutes.PROFILE]: '/profile',
  [AppRoutes.LOGIN]: '/auth/login',
  [AppRoutes.REGISTER]: '/auth/register',
  [AppRoutes.NOT_FOUND]: '*',
};
