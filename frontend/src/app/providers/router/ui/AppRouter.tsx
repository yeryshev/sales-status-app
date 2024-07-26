import { Loader } from '@/shared/ui/Loader';
import { Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { routerConfig } from '../config/routerConfig';
import { AppRouteProps } from '@/shared/types/router';
import { Helmet } from 'react-helmet';

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

  return (
    <>
      <Helmet>
        <title>Status App</title>
      </Helmet>
      <Routes>{Object.values(routerConfig).map(renderWithWrapper)}</Routes>
    </>
  );
};

export default AppRouter;
