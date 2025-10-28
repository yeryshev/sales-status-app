export enum AppRoutes {
  MAIN = 'main',
  ACCOUNT_MANAGERS = 'accountManagers',
  CUSTOMER_CARE = 'customerCare',
  TELEGRAM_CHATS = 'telegramChats',
  PROFILE = 'profile',
  STATUS_ANALYTICS = 'statusAnalytics',
  LOGIN = 'login',
  NOT_FOUND = 'error',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.ACCOUNT_MANAGERS]: '/account-managers',
  [AppRoutes.CUSTOMER_CARE]: '/customer-care',
  [AppRoutes.TELEGRAM_CHATS]: '/telegram-chats',
  [AppRoutes.PROFILE]: '/profile',
  [AppRoutes.STATUS_ANALYTICS]: '/status-analytics',
  [AppRoutes.LOGIN]: '/auth/login',
  [AppRoutes.NOT_FOUND]: '*',
};
