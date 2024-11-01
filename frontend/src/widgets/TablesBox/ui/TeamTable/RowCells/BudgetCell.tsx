import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { UserTasks } from '@/entities/Team';

interface CommentCellProps {
  tasks: UserTasks;
}

export const BudgetCell = memo((props: CommentCellProps) => {
  const { tasks } = props;
  const budget = tasks?.budget?.toLocaleString('ru-RU');

  return <Typography variant={'body2'}>{budget === '0' ? '' : budget}</Typography>;
});
