import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { Navigate, useLocation } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const authData = useSelector(getUserAuthData);
    const location = useLocation();

    if (!authData) {
        return <Navigate to={RoutePath.login} state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
