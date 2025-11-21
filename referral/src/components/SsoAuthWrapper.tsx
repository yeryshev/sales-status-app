import { useAuth } from 'react-oidc-context';
import { useEffect, useState, useRef, type ReactNode } from 'react';
import { SsoLoadingScreen } from './SsoLoadingScreen';
import { SsoErrorScreen } from './SsoErrorScreen';
import { logger } from '@/lib/logger';

interface SsoAuthWrapperProps {
  children: ReactNode;
}

export const SsoAuthWrapper = ({ children }: SsoAuthWrapperProps) => {
  const auth = useAuth();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectAttemptedRef = useRef(false);
  const errorHandledRef = useRef(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Доступность OIDC-контекста
  const isAuthContextAvailable =
    !!auth && typeof (auth as { isAuthenticated?: boolean }).isAuthenticated !== 'undefined';

  // Проверка на CORS ошибки и сетевые ошибки через глобальный обработчик
  useEffect(() => {
    if (!isAuthContextAvailable) {
      return;
    }

    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      if (
        errorMessage.includes('CORS') ||
        errorMessage.includes('ERR_FAILED') ||
        errorMessage.includes('openid-configuration') ||
        errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('Failed to fetch')
      ) {
        logger.error('CORS or network error detected:', errorMessage);
        if (!errorHandledRef.current) {
          errorHandledRef.current = true;
          // Используем setTimeout для асинхронного обновления состояния
          setTimeout(() => {
            setHasError(true);
            setErrorMessage('Не удалось подключиться к серверу авторизации. Возможно, проблема с сетью или CORS политикой.');
          }, 0);
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason || '');
      if (
        errorMessage.includes('CORS') ||
        errorMessage.includes('ERR_FAILED') ||
        errorMessage.includes('openid-configuration') ||
        errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('Failed to fetch')
      ) {
        logger.error('Unhandled promise rejection (CORS/network):', errorMessage);
        if (!errorHandledRef.current) {
          errorHandledRef.current = true;
          // Используем setTimeout для асинхронного обновления состояния
          setTimeout(() => {
            setHasError(true);
            setErrorMessage('Не удалось подключиться к серверу авторизации. Возможно, проблема с сетью или CORS политикой.');
          }, 0);
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isAuthContextAvailable]);

  // Автоматическая попытка авторизации при загрузке (только один раз)
  useEffect(() => {
    if (!isAuthContextAvailable || hasError) {
      return;
    }

    // Если пользователь не авторизован и не идет процесс загрузки
    if (
      !auth.isAuthenticated &&
      !auth.isLoading &&
      !auth.activeNavigator &&
      !auth.error &&
      !redirectAttemptedRef.current
    ) {
      redirectAttemptedRef.current = true;
      logger.log('User not authenticated, redirecting to SSO...');
      
      // Пытаемся выполнить редирект с обработкой ошибок
      auth.signinRedirect().catch((error) => {
        logger.error('Failed to redirect to SSO:', error);
        if (!errorHandledRef.current) {
          errorHandledRef.current = true;
          const errorMsg = error?.message || String(error);
          // Используем setTimeout для асинхронного обновления состояния
          setTimeout(() => {
            setHasError(true);
            if (errorMsg.includes('CORS') || errorMsg.includes('fetch') || errorMsg.includes('network')) {
              setErrorMessage('Не удалось подключиться к серверу авторизации. Возможно, проблема с сетью или CORS политикой.');
            } else {
              setErrorMessage('Не удалось перенаправить на страницу авторизации. Пожалуйста, попробуйте обновить страницу.');
            }
          }, 0);
        }
      });
    }
  }, [isAuthContextAvailable, auth, hasError]);

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

  // Обработка ошибок авторизации
  useEffect(() => {
    if (!isAuthContextAvailable || errorHandledRef.current) {
      return;
    }

    // Если произошла ошибка авторизации
    if (auth.error) {
      logger.error('SSO Error:', auth.error);
      
      // Проверяем тип ошибки
      const errorMessage = auth.error.message || String(auth.error);
      if (
        errorMessage.includes('CORS') ||
        errorMessage.includes('ERR_FAILED') ||
        errorMessage.includes('openid-configuration') ||
        errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('Failed to fetch')
      ) {
        // CORS или сетевая ошибка - показываем экран ошибки
        errorHandledRef.current = true;
        // Используем setTimeout для асинхронного обновления состояния
        setTimeout(() => {
          setHasError(true);
          setErrorMessage('Не удалось подключиться к серверу авторизации. Возможно, проблема с сетью или CORS политикой.');
        }, 0);
      } else {
        // Другие ошибки - показываем экран ошибки
        errorHandledRef.current = true;
        // Используем setTimeout для асинхронного обновления состояния
        setTimeout(() => {
          setHasError(true);
          setErrorMessage('Произошла ошибка при попытке авторизации через SSO.');
        }, 0);
      }
    }
  }, [isAuthContextAvailable, auth.error]);

  // Таймаут для загрузки - если загрузка идет слишком долго, показываем ошибку
  useEffect(() => {
    if (!isAuthContextAvailable || hasError || auth.isAuthenticated) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      return;
    }

    // Устанавливаем таймаут только если идет загрузка
    if (auth.isLoading && !auth.isAuthenticated) {
      loadingTimeoutRef.current = setTimeout(() => {
        if (auth.isLoading && !auth.isAuthenticated && !errorHandledRef.current) {
          logger.error('SSO loading timeout after 30 seconds');
          errorHandledRef.current = true;
          setHasError(true);
          setErrorMessage('Превышено время ожидания авторизации. Возможно, проблема с сетью. Пожалуйста, попробуйте обновить страницу.');
        }
      }, 30000); // 30 секунд таймаут
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isAuthContextAvailable, auth.isLoading, auth.isAuthenticated, hasError]);

  // Если контекст недоступен (например, в тестах)
  if (!isAuthContextAvailable) {
    return <>{children}</>;
  }

  // Если произошла ошибка - показываем экран ошибки
  if (hasError) {
    return <SsoErrorScreen message={errorMessage} />;
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
