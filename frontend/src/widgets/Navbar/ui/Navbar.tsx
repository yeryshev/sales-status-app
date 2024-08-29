import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeSwitcher } from '@/features/ThemeSwitcher';
import { memo } from 'react';

import { RoutePath } from '@/shared/const/router';
import { LogoutUser } from '@/features/LogoutUser';

interface NavbarProps {
  toggleSideBar: () => () => void;
}

export const Navbar = memo(({ toggleSideBar }: NavbarProps) => {
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
              Sales Status
            </Link>
          </Typography>
          <ThemeSwitcher />
          <LogoutUser />
        </Toolbar>
      </AppBar>
    </>
  );
});
