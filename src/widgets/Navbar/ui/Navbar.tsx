import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { NavbarItems } from './NavbarItems';
import { useState, KeyboardEvent, MouseEvent } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { clearUser } from '@/features/user/actions/userActions';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Theme } from '@/app/providers/ThemeProvider/lib/ThemeContext';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await dispatch(clearUser());
    navigate('/');
  };

  const toggleDrawer = () => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpen(!open);
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
            onClick={toggleDrawer()}
            sx={{ marginRight: '36px' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
              Inbound Sales
            </Link>
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme.palette.mode === Theme.DARK ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer()}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer()}
          onKeyDown={toggleDrawer()}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <NavbarItems />
          </List>
        </Box>
      </Drawer>
    </>
  );
};
