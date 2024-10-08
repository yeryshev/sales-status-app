import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/User';
import { Navigate, useLocation } from 'react-router-dom';

import { RoutePath } from '@/shared/const/router';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const authData = useSelector(getUserData);
  const location = useLocation();

  if (!authData) {
    return <Navigate to={RoutePath.login} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
