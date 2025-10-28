import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

import { getUserData } from '@/entities/User';
import { RoutePath } from '@/shared/const/router';

interface RequireSuperuserProps {
  children: ReactNode;
}

export const RequireSuperuser = ({ children }: RequireSuperuserProps) => {
  const userData = useSelector(getUserData);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!userData) {
    return <Navigate to={RoutePath.login} replace />;
  }

  // Если пользователь не суперпользователь, показываем сообщение об отказе в доступе
  if (!userData.isSuperuser) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          p: 3,
        }}
      >
        <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Доступ запрещен
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          У вас нет прав для доступа к этой странице.
          <br />
          Только суперпользователи могут просматривать аналитику статусов.
        </Typography>
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          Если вы считаете, что у вас должен быть доступ к этой странице, обратитесь к администратору системы.
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};
