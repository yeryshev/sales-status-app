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

// Функция для получения стандартного MUI color prop для Chip
const getStatusChipColor = (statusTitle: string): 'success' | 'default' | 'info' => {
  const title = statusTitle.toLowerCase();

  // Оффлайн статусы - серый цвет
  if (title.includes('оффлайн') || title.includes('offline')) {
    return 'default';
  }

  // Рабочие статусы - зеленый цвет
  if (title.includes('работаю') || title.includes('работа') || title.includes('work')) {
    return 'success';
  }

  // Остальные статусы - синий цвет
  return 'info';
};

export const StatusAnalyticsTable = memo(() => {
  const analytics = useAppSelector(getStatusAnalytics);
  const loading = useAppSelector(getStatusAnalyticsLoading);

  // Функция для форматирования времени в формат "5ч 9м"
  const formatDuration = (hours: number) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h > 0 && m > 0) {
      return `${h}ч ${m}м`;
    } else if (h > 0) {
      return `${h}ч`;
    } else {
      return `${m}м`;
    }
  };

  // Функция для форматирования даты и времени в московском времени
  const formatDateTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow',
    });
  };

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
                    <Chip label={item.statusTitle} size="small" color={getStatusChipColor(item.statusTitle)} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDateTime(item.startTime)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.endTime ? formatDateTime(item.endTime) : 'Текущий'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatDuration(item.totalDurationHours)}
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
