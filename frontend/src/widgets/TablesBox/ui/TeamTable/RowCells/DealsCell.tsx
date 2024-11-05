import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { Teammate, UserTasks } from '@/entities/Team';

interface DealsCellProps {
  tasks: UserTasks;
  teammate: Teammate;
}

export const DealsCell = memo((props: DealsCellProps) => {
  const { tasks, teammate } = props;
  const emptyValue = teammate?.isCoordinator ? '' : 0;

  return tasks && <Typography variant={'body2'}>{tasks?.deals || emptyValue}</Typography>;
});
