import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearUser } from '@/entities/User';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { memo, useCallback } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';

interface NavbarProps {
  toggleSideBar: () => () => void;
}

export const Navbar = memo(({ toggleSideBar }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(clearUser()).then(() => navigate(RoutePath.login));
  }, [dispatch, navigate]);

  return (
    <>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: '24px',
            backgroundColor: 'rgb(39, 39, 39)',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSideBar()}
            sx={{ marginRight: '36px' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link to={RoutePath.main} style={{ textDecoration: 'none', color: 'inherit' }}>
              Sales Team
            </Link>
          </Typography>
          <ThemeSwitcher />
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
});
