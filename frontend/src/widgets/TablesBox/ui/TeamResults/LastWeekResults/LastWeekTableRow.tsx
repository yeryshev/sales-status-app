import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Teammate, UserLastWeekStats, UserTasks } from '@/entities/Team';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/User';

const medalMapper: Record<number, string> = {
  0: '🥇',
  1: '🥈',
  2: '🥉',
};

interface LastWeekTableRowProps {
  teammate: Teammate;
  tasks: UserTasks;
  teamIsLoading: boolean;
  lastWeekStats: UserLastWeekStats;
  index: number;
}

export const LastWeekTableRow = memo((props: LastWeekTableRowProps) => {
  const { teammate, lastWeekStats, index } = props;
  const user = useSelector(getUserData);

  return (
    <TableRow key={teammate.id} hover={true} selected={teammate.id === user?.id}>
      <TableCell align="left" height={63}>
        <Typography
          variant={'body2'}
        >{`${teammate.firstName} ${teammate.secondName} ${medalMapper[index] || ''}`}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant={'body2'}>{Number(lastWeekStats?.deals) || 0}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant={'body2'}>{`${lastWeekStats?.budget?.toLocaleString('ru-RU') || 0}`}</Typography>
      </TableCell>
    </TableRow>
  );
});
