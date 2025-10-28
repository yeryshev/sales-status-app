import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

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

  // Если пользователь не суперпользователь, перенаправляем на 404 страницу
  if (!userData.isSuperuser) {
    return <Navigate to={RoutePath.error} replace />;
  }

  return <>{children}</>;
};
