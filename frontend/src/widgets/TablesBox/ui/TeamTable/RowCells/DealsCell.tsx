import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { AdditionalUserData, Teammate } from '@/entities/Team';

interface DealsCellProps {
  deals: AdditionalUserData['deals'];
  teammate: Teammate;
}

export const DealsCell = memo((props: DealsCellProps) => {
  const { deals, teammate } = props;
  const emptyValue = teammate?.isCoordinator ? '' : 0;

  return deals && <Typography variant={'body2'}>{deals?.newSale || emptyValue}</Typography>;
});
