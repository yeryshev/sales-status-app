import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from './MainListItems';
import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearUser } from '../../features/user/actions/userActions';
import { useAppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useColorModeCtx } from '../../helpers/contexts/themeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AnimatedCircle } from '../AnimatedCircle';

const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useColorModeCtx();

  const handleLogout = async () => {
    await dispatch(clearUser());
    navigate('/');
  };

  useEffect(() => {
    const existingPreference = localStorage.getItem('themeState');
    if (existingPreference) {
      existingPreference === 'light'
        ? colorMode.setColorMode('light')
        : colorMode.setColorMode('dark');
    } else {
      colorMode.setColorMode('light');
      localStorage.setItem('themeState', 'light');
    }
  }, [colorMode]);

  const handleToggleTheme = () => {
    const prevTheme = localStorage.getItem('themeState');
    const newTheme = prevTheme === 'light' ? 'dark' : 'light';
    colorMode.toggleColorMode();
    localStorage.setItem('themeState', newTheme);
  };

  const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: '24px',
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
          <AnimatedCircle />
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Team Status
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={() => handleToggleTheme()} color="inherit">
            {theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
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
            <MainListItems />
          </List>
        </Box>
      </Drawer>
      {children}
    </Box>
  );
};

export default Layout;
