import { memo, useState } from 'react';
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
  TablePagination,
  Tooltip,
} from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusHistory, getStatusAnalyticsLoading } from '@/entities/StatusAnalytics';

export const StatusHistoryTable = memo(() => {
  const history = useAppSelector(getStatusHistory);
  const loading = useAppSelector(getStatusAnalyticsLoading);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Загрузка истории...
        </Typography>
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Нет истории изменений
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Попробуйте изменить параметры фильтрации
        </Typography>
      </Paper>
    );
  }

  const paginatedHistory = history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}ч ${minutes}м ${secs}с`;
    } else if (minutes > 0) {
      return `${minutes}м ${secs}с`;
    }
    return `${secs}с`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        История изменений статусов
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID пользователя</TableCell>
              <TableCell>Старый статус</TableCell>
              <TableCell>Новый статус</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Окончание</TableCell>
              <TableCell align="right">Продолжительность</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHistory.map(
              (record: {
                id: number;
                userId: number;
                oldStatusId: number | null;
                newStatusId: number;
                startTime: string;
                endTime: string | null;
                durationSeconds: number | null;
              }) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {record.userId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {record.oldStatusId ? (
                      <Chip label={`ID: ${record.oldStatusId}`} size="small" color="default" variant="outlined" />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={`ID: ${record.newStatusId}`} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={record.startTime}>
                      <Typography variant="body2">{formatDateTime(record.startTime)}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {record.endTime ? (
                      <Tooltip title={record.endTime}>
                        <Typography variant="body2">{formatDateTime(record.endTime)}</Typography>
                      </Tooltip>
                    ) : (
                      <Chip label="Активен" size="small" color="success" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {formatDuration(record.durationSeconds)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={history.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count !== -1 ? count : `более чем ${to}`}`}
      />
    </Paper>
  );
});
