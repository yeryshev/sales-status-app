import { memo } from 'react';
import { TableRow, TableCell, Avatar, Typography } from '@mui/material';
import { TeamResultsRowProps } from './types';

export const TeamResultsRow = memo((props: TeamResultsRowProps) => {
  const { row, isCurrentWeek, topBudgetUsers, isSelected } = props;

  const displayName = isCurrentWeek ? row.name : `${row.name} ${topBudgetUsers[row.id] || ''}`;

  return (
    <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', height: 63 }} selected={isSelected}>
      <TableCell align="left">
        {isCurrentWeek && <Avatar alt={row.name} src={row.avatar} sx={{ width: 50, height: 50 }} />}
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{displayName}</Typography>
      </TableCell>

      <TableCell align="right">
        <Typography variant="body2">{row.deals}</Typography>
      </TableCell>

      <TableCell align="right">
        <Typography variant="body2">{row.budget.toLocaleString('ru-RU')}</Typography>
      </TableCell>
    </TableRow>
  );
});
