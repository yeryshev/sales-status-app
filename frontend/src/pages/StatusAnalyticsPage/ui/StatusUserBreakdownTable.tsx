import { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Box,
} from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalyticsSummary, getStatusAnalyticsLoading } from '@/entities/StatusAnalytics';
import { getStatusChipColor } from '@/entities/StatusAnalytics';
import { formatDurationFromSeconds } from '@/entities/StatusAnalytics';

export const StatusUserBreakdownTable = memo(() => {
  const summary = useAppSelector(getStatusAnalyticsSummary);
  const loading = useAppSelector(getStatusAnalyticsLoading);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!summary?.byUserStatus.length) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Сводка по сотрудникам и статусам
      </Typography>
      {summary.isAveraged && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Среднее время за рабочий день (дни полного оффлайна не учитываются)
        </Typography>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Сотрудник</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="right">Время</TableCell>
              <TableCell align="right">Доля</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.byUserStatus.flatMap((userRow) => {
              const userTotal = userRow.statuses.reduce((sum, status) => sum + status.durationSeconds, 0);
              return userRow.statuses.map((status, index) => (
                <TableRow key={`${userRow.userId}-${status.statusId}`}>
                  <TableCell>
                    {index === 0 ? (
                      <Typography variant="body2" fontWeight={600}>
                        {userRow.userName}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Chip label={status.statusTitle} size="small" color={getStatusChipColor(status.statusId)} />
                  </TableCell>
                  <TableCell align="right">{formatDurationFromSeconds(status.durationSeconds)}</TableCell>
                  <TableCell align="right">
                    {userTotal > 0 ? `${Math.round((status.durationSeconds / userTotal) * 100)}%` : '—'}
                  </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
});
