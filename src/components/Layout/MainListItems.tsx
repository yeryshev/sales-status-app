import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from 'react-router-dom';
// import ScheduleIcon from '@mui/icons-material/Schedule';

const MainListItems = () => {
  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Дашборд" />
      </ListItemButton>
      {/* <ListItemButton component={Link} to="/planner">
        <ListItemIcon>
          <ScheduleIcon />
        </ListItemIcon>
        <ListItemText primary="Планировщик" />
      </ListItemButton> */}
      <ListItemButton component={Link} to="/profile">
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Профиль" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainListItems;
