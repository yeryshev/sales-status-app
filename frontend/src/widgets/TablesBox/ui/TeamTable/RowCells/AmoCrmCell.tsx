import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';
import { formatValue } from '@/shared/lib/formatValue';

interface AmoCrmCellProps {
  budget: AdditionalUserData['budget'];
  deals: AdditionalUserData['deals'];
  teammate: User;
}

export const AmoCrmCell = memo((props: AmoCrmCellProps) => {
  const { budget, deals, teammate } = props;

  if (teammate?.isCoordinator) {
    return null;
  }

  const budgetValue = budget?.newSaleAndUpsale;
  const dealsValue = deals?.newSale;

  if (budgetValue === null && dealsValue === null) {
    return <Typography variant="body2" color="textSecondary"></Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25, minWidth: 80 }}>
      <Typography variant="body2" color={'primary.main'} sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
        {budgetValue !== null ? formatValue(budgetValue) : '—'}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
        {dealsValue !== null ? `сделок ${dealsValue}` : '—'}
      </Typography>
    </Box>
  );
});
