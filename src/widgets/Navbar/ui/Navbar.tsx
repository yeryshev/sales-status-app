import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch } from '@/app/redux/store';
import { clearUser } from '@/features/user/actions/userActions';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { memo } from 'react';

interface NavbarProps {
  toggleSideBar: () => () => void;
}

export const Navbar = memo(({ toggleSideBar }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(clearUser());
    navigate('/');
  };

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
            <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
              Inbound Sales
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
