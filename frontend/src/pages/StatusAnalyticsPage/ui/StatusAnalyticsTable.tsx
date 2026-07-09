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
  Box,
  LinearProgress,
} from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalytics, getStatusAnalyticsLoading } from '@/entities/StatusAnalytics';
import { formatDateTimeMoscow, formatDurationFromHours } from '@/entities/StatusAnalytics';
import { getStatusChipColorByTitle } from '@/entities/StatusAnalytics';

export const StatusAnalyticsTable = memo(({ loading: externalLoading }: { loading?: boolean }) => {
  const analytics = useAppSelector(getStatusAnalytics);
  const storeLoading = useAppSelector(getStatusAnalyticsLoading);
  const loading = externalLoading ?? storeLoading;

  // Функция для форматирования даты и времени в московском времени
  const formatDateTime = formatDateTimeMoscow;

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
      {/* Таблица */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пользователь</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Время начала</TableCell>
              <TableCell>Время окончания</TableCell>
              <TableCell align="right">Продолжительность</TableCell>
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
                  startTime: string;
                  endTime: string | null;
                  totalDurationHours: number;
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
                    <Chip label={item.statusTitle} size="small" color={getStatusChipColorByTitle(item.statusTitle)} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDateTime(item.startTime)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.endTime ? formatDateTime(item.endTime) : 'Текущий'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatDurationFromHours(item.totalDurationHours)}
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
