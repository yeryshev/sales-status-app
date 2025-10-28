import { memo, useEffect } from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Button, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import {
  getStatusAnalyticsFilters,
  getUsersForAnalytics,
  getStatusesForAnalytics,
  setFilters,
  fetchUsersForAnalytics,
  fetchStatusesForAnalytics,
} from '@/entities/StatusAnalytics';

interface StatusAnalyticsFiltersProps {
  onApplyFilters: () => void;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
}

export const StatusAnalyticsFilters = memo(({ onApplyFilters, onFiltersChange }: StatusAnalyticsFiltersProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const users = useAppSelector(getUsersForAnalytics);
  const statuses = useAppSelector(getStatusesForAnalytics);

  // Загружаем данные для фильтров при монтировании
  useEffect(() => {
    dispatch(fetchUsersForAnalytics());
    dispatch(fetchStatusesForAnalytics());
  }, [dispatch]);

  const handleFilterChange = (field: keyof typeof filters, value: unknown) => {
    let newFilters: Partial<typeof filters>;

    // При изменении типа периода, синхронизируем даты
    if (field === 'periodType') {
      if (value === 'day') {
        // Для дня устанавливаем одинаковые даты
        newFilters = {
          ...filters,
          [field]: value as 'day' | 'week' | 'month',
          startDate: filters.startDate,
          endDate: filters.startDate,
        };
        dispatch(setFilters(newFilters));
      } else {
        // Для недели/месяца оставляем интервал
        newFilters = { ...filters, [field]: value as 'day' | 'week' | 'month' };
        dispatch(setFilters(newFilters));
      }
    } else if (field === 'startDate' && filters.periodType === 'day') {
      // При изменении даты для дня, синхронизируем обе даты
      newFilters = {
        ...filters,
        startDate: value as string,
        endDate: value as string,
      };
      dispatch(setFilters(newFilters));
    } else {
      newFilters = { ...filters, [field]: value };
      dispatch(setFilters(newFilters));
    }

    // Обновляем URL параметры
    if (onFiltersChange && newFilters) {
      onFiltersChange(newFilters);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters();
  };

  const handleClearFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(
      setFilters({
        userId: undefined,
        statusId: undefined,
        startDate: today,
        endDate: today,
        periodType: 'day',
      }),
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Фильтры аналитики
        </Typography>

        <Grid container spacing={3} alignItems="center">
          {/* Пользователь */}
          <Grid item xs={12} sm={6} md={filters.periodType === 'day' ? 4 : 3}>
            <FormControl fullWidth>
              <InputLabel>Пользователь</InputLabel>
              <Select
                value={filters.userId || ''}
                onChange={(e) => handleFilterChange('userId', e.target.value || undefined)}
                label="Пользователь"
              >
                <MenuItem value="">
                  <em>Все пользователи</em>
                </MenuItem>
                {users.map((user: { id: number; name: string; email: string }) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Статус */}
          <Grid item xs={12} sm={6} md={filters.periodType === 'day' ? 4 : 3}>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={filters.statusId || ''}
                onChange={(e) => handleFilterChange('statusId', e.target.value || undefined)}
                label="Статус"
              >
                <MenuItem value="">
                  <em>Все статусы</em>
                </MenuItem>
                {statuses.map((status: { id: number; title: string }) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Период */}
          <Grid item xs={12} sm={6} md={filters.periodType === 'day' ? 2 : 2}>
            <FormControl fullWidth>
              <InputLabel>Период</InputLabel>
              <Select
                value={filters.periodType}
                onChange={(e) => handleFilterChange('periodType', e.target.value)}
                label="Период"
              >
                <MenuItem value="day">День</MenuItem>
                <MenuItem value="week">Неделя</MenuItem>
                <MenuItem value="month">Месяц</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Дата - один календарь для дня, два для недели/месяца */}
          {filters.periodType === 'day' ? (
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Дата"
                value={new Date(filters.startDate)}
                onChange={(date) => handleFilterChange('startDate', date?.toISOString().split('T')[0] || '')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          ) : (
            <>
              {/* Дата начала */}
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Дата начала"
                  value={new Date(filters.startDate)}
                  onChange={(date) => handleFilterChange('startDate', date?.toISOString().split('T')[0] || '')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Дата окончания */}
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Дата окончания"
                  value={new Date(filters.endDate)}
                  onChange={(date) => handleFilterChange('endDate', date?.toISOString().split('T')[0] || '')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </>
          )}

          {/* Кнопки */}
          <Grid item xs={12} sm={12} md={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                Очистить
              </Button>
              <Button variant="contained" startIcon={<SearchIcon />} onClick={handleApplyFilters}>
                Применить фильтры
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
});
