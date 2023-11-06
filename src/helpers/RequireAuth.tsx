import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { checkUser } from '../features/user/actions/userActions';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    dispatch(checkUser()).then(() => {
      setAuthLoading(false);
    });
  }, [dispatch]);

  if (authLoading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return user ? children : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
