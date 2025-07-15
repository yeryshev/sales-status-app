import { memo } from 'react';
import { TableCell, Tooltip } from '@mui/material';
import { CustomerCareTableHeaderItemType } from './getCustomerCareTableHeadersList';

interface CustomerCareTeamTableHeaderItemProps {
  item: CustomerCareTableHeaderItemType;
}

export const CustomerCareTeamTableHeaderItem = memo((props: CustomerCareTeamTableHeaderItemProps) => {
  const { item } = props;

  return (
    <TableCell align={item.align}>
      {item.title && item.content ? <Tooltip title={item.title}>{item.content}</Tooltip> : item.content}
    </TableCell>
  );
});
