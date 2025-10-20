import { useAuth } from 'react-oidc-context';
import { Button, Box, Typography, Alert } from '@mui/material';
import { memo, useCallback } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import RefreshIcon from '@mui/icons-material/Refresh';
import { logger } from '@/shared/lib/utils/logger';

export const SsoButton = memo(() => {
  const auth = useAuth();
  const isAuthContextAvailable =
    !!auth && typeof (auth as unknown as { isAuthenticated?: boolean }).isAuthenticated !== 'undefined';

  const handleSsoLogin = useCallback(() => {
    logger.log('Starting SSO login...');
    if (isAuthContextAvailable) {
      auth?.signinRedirect();
    }
  }, [auth, isAuthContextAvailable]);

  const handleRetry = useCallback(() => {
    logger.log('Retrying SSO login...');
    // Очищаем ошибку и пытаемся снова
    if (isAuthContextAvailable) {
      auth?.signinRedirect();
    }
  }, [auth, isAuthContextAvailable]);

  // Функция для получения понятного сообщения об ошибке
  type ErrorInfo = { title: string; description: string; action: string } | null;
  const getErrorMessage = (error: unknown): ErrorInfo => {
    if (!error) return null;

    const message = (error as { message?: string }).message || String(error);

    if (message.includes('No matching state found in storage')) {
      return {
        title: 'Проблема с авторизацией',
        description:
          'Произошла ошибка при возврате с сервера авторизации. Это может произойти из-за блокировки cookies или проблем с браузером.',
        action: 'Попробуйте снова или очистите cookies браузера',
      };
    }

    if (message.includes('Network Error') || message.includes('fetch')) {
      return {
        title: 'Проблема с сетью',
        description: 'Не удается подключиться к серверу авторизации. Проверьте подключение к интернету.',
        action: 'Попробуйте снова через несколько секунд',
      };
    }

    return {
      title: 'Ошибка авторизации',
      description: message,
      action: 'Попробуйте снова',
    };
  };

  const errorInfo = getErrorMessage(
    isAuthContextAvailable ? (auth as unknown as { error?: unknown })?.error : undefined,
  );

  return (
    <Box sx={{ mt: 2 }}>
      {/* Показываем кнопку SSO только если нет ошибки */}
      {!errorInfo && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LoginIcon />}
          onClick={handleSsoLogin}
          disabled={isAuthContextAvailable ? auth.isLoading : false}
          sx={{ mb: 1 }}
        >
          Войти через SSO
        </Button>
      )}

      {errorInfo && (
        <Alert
          severity="error"
          sx={{ mt: 2, mb: 2 }}
          action={
            <Button size="small" startIcon={<RefreshIcon />} onClick={handleRetry} sx={{ ml: 1 }}>
              Повторить
            </Button>
          }
        >
          <Typography variant="subtitle2" gutterBottom>
            {errorInfo.title}
          </Typography>
          <Typography variant="body2">{errorInfo.description}</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
            {errorInfo.action}
          </Typography>
        </Alert>
      )}
    </Box>
  );
});
