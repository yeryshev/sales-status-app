import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';
import { formatValue } from '@/shared/lib/formatValue';

interface QlikCellProps {
  qlik: AdditionalUserData['qlik'];
  teammate: User;
}

export const QlikCell = memo((props: QlikCellProps) => {
  const { qlik, teammate } = props;

  if (teammate?.isCoordinator) {
    return null;
  }

  if (!qlik) {
    return <Typography variant="body2" color="textSecondary"></Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25, minWidth: 80 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main', fontSize: '0.875rem' }}>
        {formatValue(qlik.factWithK)}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
        прогноз {formatValue(qlik.forecastWithK)}
      </Typography>
    </Box>
  );
});
