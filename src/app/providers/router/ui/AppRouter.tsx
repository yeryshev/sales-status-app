import Loader from '@/shared/ui/Loader/Loader';
import { Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from '@/app/providers/router/ui/RequireAuth';
import { routerConfig } from '@/app/providers/router/config/routerConfig';
import { AppRouteProps } from '@/shared/types/router';

const AppRouter = () => {
  const renderWithWrapper = useCallback((route: AppRouteProps) => {
    const element = <Suspense fallback={<Loader />}>{route.element}</Suspense>;
    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.authOnly ? <RequireAuth>{element}</RequireAuth> : element}
      />
    );
  }, []);

  return <Routes>{Object.values(routerConfig).map(renderWithWrapper)}</Routes>;
};

export default AppRouter;
