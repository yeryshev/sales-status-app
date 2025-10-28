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
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalytics, getStatusAnalyticsLoading, getTotalDurationInHours } from '@/entities/StatusAnalytics';

export const StatusAnalyticsTable = memo(() => {
  const analytics = useAppSelector(getStatusAnalytics);
  const loading = useAppSelector(getStatusAnalyticsLoading);
  const totalHours = useAppSelector(getTotalDurationInHours);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Загрузка аналитики...
        </Typography>
      </Box>
    );
  }

  if (analytics.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Нет данных для отображения
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Попробуйте изменить параметры фильтрации
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Общая статистика */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip label={`Всего записей: ${analytics.length}`} color="primary" variant="outlined" />
        <Chip label={`Общее время: ${totalHours.toFixed(1)} ч`} color="secondary" variant="outlined" />
        <Chip
          label={`Уникальных пользователей: ${new Set(analytics.map((item: { userId: number }) => item.userId)).size}`}
          color="info"
          variant="outlined"
        />
        <Chip
          label={`Уникальных статусов: ${new Set(analytics.map((item: { statusId: number }) => item.statusId)).size}`}
          color="warning"
          variant="outlined"
        />
      </Box>

      {/* Таблица */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пользователь</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="right">Время (часы)</TableCell>
              <TableCell align="right">Время (минуты)</TableCell>
              <TableCell align="right">Время (секунды)</TableCell>
              <TableCell align="right">Процент</TableCell>
              <TableCell align="right">Изменений</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.map(
              (
                item: {
                  userId: number;
                  userName: string;
                  statusId: number;
                  statusTitle: string;
                  totalDurationHours: number;
                  totalDurationMinutes: number;
                  totalDurationSeconds: number;
                  percentage: number;
                  periods: Array<{ changesCount: number }>;
                },
                index: number,
              ) => (
                <TableRow key={`${item.userId}-${item.statusId}-${index}`}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.userName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.statusTitle} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {item.totalDurationHours.toFixed(1)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {item.totalDurationMinutes.toFixed(1)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {item.totalDurationSeconds}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.percentage.toFixed(1)}%
                      </Typography>
                      <Box
                        sx={{
                          width: 60,
                          height: 8,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min(item.percentage, 100)}%`,
                            height: '100%',
                            bgcolor:
                              item.percentage > 50
                                ? 'success.main'
                                : item.percentage > 25
                                  ? 'warning.main'
                                  : 'error.main',
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {item.periods.reduce(
                        (sum: number, period: { changesCount: number }) => sum + period.changesCount,
                        0,
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
});
