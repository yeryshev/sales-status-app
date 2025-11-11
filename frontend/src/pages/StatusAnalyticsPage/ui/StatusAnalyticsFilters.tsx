import { memo, useEffect, useMemo } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Paper, Typography, ListSubheader } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import {
  getStatusAnalyticsFilters,
  getUsersForAnalytics,
  getStatusesForAnalytics,
  getStatusAnalyticsDateRange,
  setFilters,
  fetchUsersForAnalytics,
  fetchStatusesForAnalytics,
  calculatePeriodDates,
  type PeriodType,
} from '@/entities/StatusAnalytics';

interface StatusAnalyticsFiltersProps {
  onFiltersChange?: (filters: Record<string, unknown>) => void;
}

export const StatusAnalyticsFilters = memo(({ onFiltersChange }: StatusAnalyticsFiltersProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const users = useAppSelector(getUsersForAnalytics);
  const statuses = useAppSelector(getStatusesForAnalytics);
  const dateRange = useAppSelector(getStatusAnalyticsDateRange);

  // Загружаем данные для фильтров при монтировании
  useEffect(() => {
    dispatch(fetchUsersForAnalytics());
    dispatch(fetchStatusesForAnalytics());
  }, [dispatch]);

  const handleFilterChange = (field: keyof typeof filters, value: unknown) => {
    let newFilters: typeof filters;

    // При изменении типа периода, рассчитываем новые даты
    if (field === 'periodType') {
      const periodType = value as PeriodType;

      if (periodType === 'custom') {
        // Для произвольного периода оставляем текущие даты
        newFilters = {
          ...filters,
          periodType,
        };
      } else {
        // Для всех остальных периодов рассчитываем даты автоматически
        const { startDate, endDate } = calculatePeriodDates(periodType);
        newFilters = {
          ...filters,
          periodType,
          startDate,
          endDate,
        };
      }
    } else if (field === 'startDate' || field === 'endDate') {
      // При изменении дат переключаемся на произвольный период
      newFilters = {
        ...filters,
        [field]: value as string,
        periodType: 'custom',
      };
    } else {
      newFilters = { ...filters, [field]: value };
    }

    // Обновляем Redux state
    dispatch(setFilters(newFilters));

    // Обновляем URL параметры с полными фильтрами
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Группируем пользователей по отделам
  const groupedUsers = useMemo(() => {
    const managers: typeof users = [];
    const accountManagers: typeof users = [];
    const customerCare: typeof users = [];

    users.forEach((user) => {
      if (user.isManager) {
        managers.push(user);
      }
      if (user.isAccountManager) {
        accountManagers.push(user);
      }
      if (user.isCcManager) {
        customerCare.push(user);
      }
    });

    return {
      managers,
      accountManagers,
      customerCare,
    };
  }, [users]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Фильтры аналитики
        </Typography>

        <Grid container spacing={3} alignItems="center">
          {/* Отдел */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Отдел</InputLabel>
              <Select
                value={filters.departmentId || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const newDepartmentId = value
                    ? (value as 'managers' | 'account_managers' | 'customer_care')
                    : undefined;
                  // При выборе отдела сбрасываем userId в том же вызове
                  const newFilters = {
                    ...filters,
                    departmentId: newDepartmentId,
                    userId: newDepartmentId ? undefined : filters.userId, // Сбрасываем userId только если выбран отдел
                  };
                  dispatch(setFilters(newFilters));
                  if (onFiltersChange) {
                    onFiltersChange(newFilters);
                  }
                }}
                label="Отдел"
              >
                <MenuItem value="">
                  <em>Все отделы</em>
                </MenuItem>
                <MenuItem value="managers">Входящие продажи</MenuItem>
                <MenuItem value="account_managers">Аккаунт-менеджеры</MenuItem>
                <MenuItem value="customer_care">Customer Care</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Пользователь */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Пользователь</InputLabel>
              <Select
                value={users.find((user) => user.id === filters.userId) ? filters.userId || '' : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const userId = value ? (typeof value === 'number' ? value : parseInt(value)) : undefined;
                  // При выборе пользователя сбрасываем departmentId в том же вызове
                  const newFilters = {
                    ...filters,
                    userId: userId,
                    departmentId: userId ? undefined : filters.departmentId, // Сбрасываем departmentId только если выбран пользователь
                  };
                  dispatch(setFilters(newFilters));
                  if (onFiltersChange) {
                    onFiltersChange(newFilters);
                  }
                }}
                label="Пользователь"
              >
                <MenuItem value="">
                  <em>Все пользователи</em>
                </MenuItem>
                {groupedUsers.managers.length > 0 && [
                  <ListSubheader key="managers-header">Входящие продажи</ListSubheader>,
                  ...groupedUsers.managers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  )),
                ]}
                {groupedUsers.accountManagers.length > 0 && [
                  <ListSubheader key="account-managers-header">Аккаунт-менеджеры</ListSubheader>,
                  ...groupedUsers.accountManagers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  )),
                ]}
                {groupedUsers.customerCare.length > 0 && [
                  <ListSubheader key="customer-care-header">Customer Care</ListSubheader>,
                  ...groupedUsers.customerCare.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  )),
                ]}
              </Select>
            </FormControl>
          </Grid>

          {/* Статус */}
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Период</InputLabel>
              <Select
                value={filters.periodType}
                onChange={(e) => handleFilterChange('periodType', e.target.value)}
                label="Период"
              >
                <MenuItem value="today">Сегодня</MenuItem>
                <MenuItem value="yesterday">Вчера</MenuItem>
                <MenuItem value="last30days">Последние 30 дней</MenuItem>
                <MenuItem value="currentWeek">Текущая неделя</MenuItem>
                <MenuItem value="lastWeek">Прошлая неделя</MenuItem>
                <MenuItem value="currentMonth">Текущий месяц</MenuItem>
                <MenuItem value="lastMonth">Прошлый месяц</MenuItem>
                <MenuItem value="custom">Произвольный период</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Дата начала - показываем всегда для произвольного периода */}
          {filters.periodType === 'custom' && (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Дата начала"
                  value={new Date(filters.startDate)}
                  onChange={(date) => handleFilterChange('startDate', date?.toISOString().split('T')[0] || '')}
                  minDate={dateRange?.minDate ? new Date(dateRange.minDate) : undefined}
                  maxDate={dateRange?.maxDate ? new Date(dateRange.maxDate) : undefined}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Дата окончания */}
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Дата окончания"
                  value={new Date(filters.endDate)}
                  onChange={(date) => handleFilterChange('endDate', date?.toISOString().split('T')[0] || '')}
                  minDate={dateRange?.minDate ? new Date(dateRange.minDate) : undefined}
                  maxDate={dateRange?.maxDate ? new Date(dateRange.maxDate) : undefined}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
});
