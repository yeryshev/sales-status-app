import { memo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';

interface QlikCellProps {
  qlik: AdditionalUserData['qlik'];
  teammate: User;
  absence?: AdditionalUserData['absence'];
}

export const QlikCell = memo((props: QlikCellProps) => {
  const { qlik, teammate } = props;

  if (teammate?.isCoordinator) {
    return null;
  }

  if (!qlik) {
    return (
      <Typography variant="body2" color="textSecondary">
        —
      </Typography>
    );
  }

  const formatValue = (value: string) => {
    const numValue = parseInt(value, 10);
    if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}М`;
    }
    if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(0)}К`;
    }
    return numValue ? numValue.toLocaleString('ru-RU') : '0';
  };

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
