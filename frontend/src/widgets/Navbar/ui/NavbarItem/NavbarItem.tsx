import { NavbarItemType } from './items';
import { memo } from 'react';
import Button from '@mui/material/Button';

interface NavbarItemProps {
  item: NavbarItemType;
}

export const NavbarItem = memo((props: NavbarItemProps) => {
  const { item } = props;
  return (
    <Button sx={{ color: '#fff' }} onClick={() => window.open(item.path, '_blank')}>
      {item.text}
    </Button>
  );
});
