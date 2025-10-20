import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoginForm } from '@/features/AuthByEmail';

export const SsoErrorScreen = memo(() => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main' }} />
      <Typography variant="h5" gutterBottom>
        Доступ по SSO не предоставлен
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
        Вы успешно авторизованы через корпоративную систему, но у вас нет доступа к данному приложению.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mt: 1 }}>
        Если вы считаете, что у вас должен быть доступ к этому приложению, обратитесь к сотрудникам ДРБ.
      </Typography>
      <Box sx={{ mt: 3, width: '100%' }}>
        <LoginForm forceEmailForm />
      </Box>
    </Box>
  );
});
