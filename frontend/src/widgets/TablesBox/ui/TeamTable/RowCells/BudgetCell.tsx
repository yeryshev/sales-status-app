import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { Teammate, UserTasks } from '@/entities/Team';

interface BudgetCellProps {
  tasks: UserTasks;
  teammate: Teammate;
}

export const BudgetCell = memo((props: BudgetCellProps) => {
  const { tasks, teammate } = props;
  const budget = tasks?.budget?.toLocaleString('ru-RU') || '0';
  const emptyValue = teammate?.isCoordinator ? '' : 0;

  return tasks && <Typography variant={'body2'}>{budget === '0' ? emptyValue : budget}</Typography>;
});
