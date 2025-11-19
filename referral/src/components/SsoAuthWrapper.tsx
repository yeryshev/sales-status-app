import { useAuth } from 'react-oidc-context';
import { useEffect, type ReactNode } from 'react';
import { SsoLoadingScreen } from './SsoLoadingScreen';
import { logger } from '@/lib/logger';

interface SsoAuthWrapperProps {
  children: ReactNode;
}

export const SsoAuthWrapper = ({ children }: SsoAuthWrapperProps) => {
  const auth = useAuth();

  // Доступность OIDC-контекста
  const isAuthContextAvailable =
    !!auth && typeof (auth as { isAuthenticated?: boolean }).isAuthenticated !== 'undefined';

  // Автоматическая попытка авторизации при загрузке
  useEffect(() => {
    if (!isAuthContextAvailable) {
      return;
    }

    // Если пользователь не авторизован и не идет процесс загрузки
    if (!auth.isAuthenticated && !auth.isLoading && !auth.activeNavigator && !auth.error) {
      logger.log('User not authenticated, redirecting to SSO...');
      auth.signinRedirect();
    }
  }, [isAuthContextAvailable, auth]);

  // Очистка query параметров после успешной авторизации
  useEffect(() => {
    if (!isAuthContextAvailable) {
      return;
    }

    // Если пользователь авторизован и есть query параметры от SSO
    if (auth.isAuthenticated && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      
      // Проверяем наличие параметров OAuth/OIDC
      if (params.has('state') || params.has('code') || params.has('session_state')) {
        logger.log('Cleaning up OAuth query parameters...');
        // Очищаем URL без перезагрузки страницы
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isAuthContextAvailable, auth.isAuthenticated]);

  // Обработка ошибок авторизации - редирект на главную страницу
  useEffect(() => {
    if (!isAuthContextAvailable) {
      return;
    }

    // Если произошла ошибка - редиректим на главную страницу
    if (auth.error) {
      logger.error('SSO Error:', auth.error);
      logger.log('Redirecting to home page due to SSO error...');
      window.location.href = '/';
    }
  }, [isAuthContextAvailable, auth.error]);

  // Если контекст недоступен (например, в тестах)
  if (!isAuthContextAvailable) {
    return <>{children}</>;
  }

  // Если идет процесс загрузки или авторизации
  if (auth.isLoading || auth.activeNavigator) {
    return <SsoLoadingScreen />;
  }

  // Если пользователь авторизован
  if (auth.isAuthenticated && auth.user) {
    logger.log('User authenticated:', auth.user.profile);
    return <>{children}</>;
  }

  // По умолчанию показываем загрузку
  return <SsoLoadingScreen />;
};

