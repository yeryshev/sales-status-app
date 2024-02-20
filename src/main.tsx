import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RequireAuth from './shared/RequireAuth.tsx';
import { Provider } from 'react-redux';
import { store } from './app/redux/store.ts';
import MainPage from './pages/Dashboard/Dashboard.tsx';
import { Suspense } from 'react';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage/index.ts';
import { SocketCtxProvider } from './app/providers/WsProvider/index.ts';
import { ColorModeCtxProvider } from './app/providers/ThemeProvider/index.ts';
import Loader from './shared/Loader.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainPage />
      </RequireAuth>
    ),
  },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <Suspense fallback={<Loader />}>
          <ProfilePage />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<Loader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ColorModeCtxProvider>
      <SocketCtxProvider>
        <RouterProvider router={router} />
      </SocketCtxProvider>
    </ColorModeCtxProvider>
  </Provider>
);
