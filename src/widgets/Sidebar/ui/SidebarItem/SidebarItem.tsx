import { Link } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { SidebarItemType } from '../../model/items';
import { memo } from 'react';

interface SidebarItemProps {
  item: SidebarItemType;
}

export const SidebarItem = memo((props: SidebarItemProps) => {
  const { item } = props;
  return (
    <ListItemButton component={Link} to={item.path}>
      <ListItemIcon>
        <item.Icon></item.Icon>
      </ListItemIcon>
      <ListItemText primary={item.text} />
    </ListItemButton>
  );
});
