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
import Planner from './Pages/PlannerPage/PlannerPage.tsx';
import NotFoundPage from './Pages/NotFound/NotFoundPage.tsx';
import Online from './Pages/TelegramWeb/Online.tsx';
import Busy from './Pages/TelegramWeb/Busy.tsx';
import Offline from './Pages/TelegramWeb/Offline.tsx';

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
    path: '/planner',
    element: (
      <RequireAuth>
        <Planner />
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
    path: '/telegram/37f5d5b8',
    element: (
      <RequireAuth>
        <Online />
      </RequireAuth>
    ),
  },
  {
    path: '/telegram/14z71ca9',
    element: (
      <RequireAuth>
        <Busy />
      </RequireAuth>
    ),
  },
  {
    path: '/telegram/11m093ccv3',
    element: (
      <RequireAuth>
        <Offline />
      </RequireAuth>
    ),
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
