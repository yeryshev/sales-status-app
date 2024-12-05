import { memo } from 'react';
import { TableCell, Tooltip } from '@mui/material';
import { TeamTableHeaderItemType } from './getTeamTableHeadersList';

interface TeamTableHeaderItemProps {
  item: TeamTableHeaderItemType;
}

export const TeamTableHeaderItem = memo((props: TeamTableHeaderItemProps) => {
  const { item } = props;

  return (
    <TableCell align={item.align}>
      {item.title && item.content ? <Tooltip title={item.title}>{item.content}</Tooltip> : item.content}
    </TableCell>
  );
});
