import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RequireAuth from './helpers/RequireAuth.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import LoginPage from './Pages/LoginPage/LoginPage.tsx';
import RegisterPage from './Pages/RegisterPage/RegisterPage.tsx';
import MainPage from './Pages/Dashboard/Dashboard.tsx';
import SocketCtxProvider from './helpers/contexts/wsContext/provider.tsx';
import ColorModeCtxProvider from './helpers/contexts/themeContext/provider.tsx';
import Profile from './Pages/Profile/Profile.tsx';
import NotFoundPage from './Pages/NotFound/NotFoundPage.tsx';

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
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
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
