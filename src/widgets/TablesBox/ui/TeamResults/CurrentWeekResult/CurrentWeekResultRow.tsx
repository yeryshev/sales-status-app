import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Avatar } from '@mui/material';
import { Teammate, UserAvatarsAndBirthday, UserTasks } from '@/entities/Team';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/User';

interface CurrentWeekResultRowProps {
  teammate: Teammate;
  tasks: UserTasks;
  teamIsLoading: boolean;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  index: number;
}

export const CurrentWeekResultRow = memo((props: CurrentWeekResultRowProps) => {
  const { teammate, tasks, avatarsAndBirthday } = props;
  const user = useSelector(getUserData);

  return (
    <TableRow key={teammate.id} hover={true} selected={teammate.id === user?.id}>
      <TableCell align="left" height={50}>
        <Avatar
          alt={`${teammate.firstName} ${teammate.secondName}`}
          src={avatarsAndBirthday?.avatar}
          sx={{ width: 50, height: 50 }}
        />
      </TableCell>
      <TableCell align="left">
        <Typography variant={'body2'}>{`${teammate.firstName} ${teammate.secondName}`}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant={'body2'}>{tasks?.deals || 0}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant={'body2'}>{tasks?.budget.toLocaleString('ru-RU') || 0}</Typography>
      </TableCell>
    </TableRow>
  );
});
