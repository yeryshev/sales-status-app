import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { AdditionalUserData, Teammate } from '@/entities/Team';

interface BudgetCellProps {
  budget: AdditionalUserData['budget'];
  teammate: Teammate;
}

export const BudgetCell = memo((props: BudgetCellProps) => {
  const { budget, teammate } = props;
  const budgetString = budget?.newSaleAndUpsale?.toLocaleString('ru-RU') || '0';
  const emptyValue = teammate?.isCoordinator ? '' : 0;

  return budget && <Typography variant={'body2'}>{budgetString === '0' ? emptyValue : budgetString}</Typography>;
});
