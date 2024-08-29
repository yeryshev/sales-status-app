import { memo, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '@/entities/User';
import { RoutePath } from '@/shared/const/router';

export const LogoutUser = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(clearUser()).then(() => navigate(RoutePath.login));
  }, [dispatch, navigate]);

  return (
    <IconButton color="inherit" onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  );
});
