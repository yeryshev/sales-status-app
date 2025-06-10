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

  return (
    deals && (
      <Typography variant={'body2'} sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
        {deals?.newSale || emptyValue}
      </Typography>
    )
  );
});
