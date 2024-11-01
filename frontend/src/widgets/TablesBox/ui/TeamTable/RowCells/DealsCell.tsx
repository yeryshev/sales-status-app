import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { UserTasks } from '@/entities/Team';

interface CommentCellProps {
  tasks: UserTasks;
}

export const DealsCell = memo((props: CommentCellProps) => {
  const { tasks } = props;

  return <Typography variant={'body2'}>{tasks?.deals || ''}</Typography>;
});
