import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Avatar } from '@mui/material';
import { Teammate } from '../../../../../entities/Team/model/types/teammate';
import { UserTasks } from '../../../../../entities/Team/model/types/tasksWebsocket';
import Typography from '@mui/material/Typography';

interface ResultsRowProps {
  teammate: Teammate;
  tasks: UserTasks;
  teamIsLoading: boolean;
  lastWeekStats: number;
}

export const LastWeekTableRow = memo((props: ResultsRowProps) => {
  const { teammate, lastWeekStats } = props;

  return (
    <TableRow key={teammate.id} hover={true}>
      <TableCell align="left" sx={{ width: '50px' }}>
        <Avatar
          alt={`${teammate.firstName} ${teammate.secondName}`}
          src={teammate.photoUrl}
          sx={{ width: 50, height: 50 }}
        />
      </TableCell>
      <TableCell align="left">
        <Typography variant={'body2'}>{`${teammate.firstName} ${teammate.secondName}`}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant={'body2'}>{lastWeekStats || 0}</Typography>
      </TableCell>
    </TableRow>
  );
});
