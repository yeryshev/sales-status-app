import { useAuth } from 'react-oidc-context';
import { memo, useEffect, useState } from 'react';
import { SsoLoadingScreen } from './SsoLoadingScreen';
import { SsoErrorScreen } from './SsoErrorScreen';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { ssoLogin } from '../model/services/ssoLogin/ssoLogin';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/const/router';
import { logger } from '@/shared/lib/utils/logger';

interface SsoAuthWrapperProps {
  children: React.ReactNode;
}

export const SsoAuthWrapper = memo(({ children }: SsoAuthWrapperProps) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ssoError, setSsoError] = useState(false);

  // Доступность OIDC-контекста (в тестах может отсутствовать)
  const isAuthContextAvailable =
    !!auth && typeof (auth as unknown as { isAuthenticated?: boolean }).isAuthenticated !== 'undefined';

  // Обработка успешной авторизации через SSO
  useEffect(() => {
    if (!isAuthContextAvailable) {
      return;
    }

    if (auth?.isAuthenticated && auth.user && auth.user.profile?.email) {
      logger.log('SSO User data:', auth.user);
      logger.log('User email:', auth.user.profile?.email);
      logger.log('User profile:', auth.user.profile);

      // Отправляем данные на бэкенд для авторизации
      dispatch(
        ssoLogin({
          email: auth.user.profile.email,
          name: auth.user.profile.name,
          preferred_username: auth.user.profile.preferred_username,
        }),
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          logger.log('SSO login successful, redirecting...');
          navigate(RoutePath.main);
        } else {
          logger.log('SSO login failed, showing error screen');
          setSsoError(true);
        }
      });
    }
  }, [isAuthContextAvailable, auth?.isAuthenticated, auth?.user, dispatch, navigate]);

  // Если пользователь авторизован через SSO, но произошла ошибка
  if (isAuthContextAvailable && auth?.isAuthenticated && auth.user && ssoError) {
    return <SsoErrorScreen />;
  }

  // Если пользователь авторизован через SSO, показываем загрузку
  if (isAuthContextAvailable && auth?.isAuthenticated && auth.user) {
    return <SsoLoadingScreen />;
  }

  // Иначе показываем обычную форму логина
  return <>{children}</>;
});
