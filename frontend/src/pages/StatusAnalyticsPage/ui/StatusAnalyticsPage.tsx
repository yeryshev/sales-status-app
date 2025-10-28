import { memo, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, Alert, Snackbar, CircularProgress, Container } from '@mui/material';
import { Analytics as AnalyticsIcon, History as HistoryIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import {
  fetchStatusAnalytics,
  fetchStatusHistory,
  getStatusAnalyticsError,
  getStatusAnalyticsFilters,
  clearError,
  setFilters,
} from '@/entities/StatusAnalytics';
import { RequireSuperuser } from '@/shared/lib/components/RequireSuperuser';
import { Layout } from '@/widgets/Layout';
import { PageWrapper } from '@/shared/ui/PageWrapper';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { StatusAnalyticsFilters } from './StatusAnalyticsFilters';
import { StatusAnalyticsTable } from './StatusAnalyticsTable';
import { StatusHistoryTable } from './StatusHistoryTable';
import { StatusTimeline } from './StatusTimeline';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const StatusAnalyticsPage = memo(() => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const error = useAppSelector(getStatusAnalyticsError);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Функция для обновления URL параметров
  const updateUrlParams = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const params = new URLSearchParams();

      if (newFilters.userId) params.set('userId', newFilters.userId.toString());
      if (newFilters.statusId) params.set('statusId', newFilters.statusId.toString());
      if (newFilters.startDate) params.set('startDate', newFilters.startDate);
      if (newFilters.endDate) params.set('endDate', newFilters.endDate);
      if (newFilters.periodType) params.set('periodType', newFilters.periodType);

      setSearchParams(params);
    },
    [setSearchParams],
  );

  // Функция для загрузки фильтров из URL
  const loadFiltersFromUrl = useCallback(() => {
    const userId = searchParams.get('userId');
    const statusId = searchParams.get('statusId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const periodType = searchParams.get('periodType') as 'day' | 'week' | 'month' | null;

    if (userId || statusId || startDate || endDate || periodType) {
      dispatch(
        setFilters({
          userId: userId ? parseInt(userId) : undefined,
          statusId: statusId ? parseInt(statusId) : undefined,
          startDate: startDate || filters.startDate,
          endDate: endDate || filters.endDate,
          periodType: periodType || filters.periodType,
        }),
      );
    }
  }, [searchParams, dispatch, filters.startDate, filters.endDate, filters.periodType]);

  const handleApplyFilters = useCallback(async () => {
    setLoading(true);
    try {
      // Обновляем URL параметры
      updateUrlParams(filters);

      // Загружаем аналитику
      await dispatch(
        fetchStatusAnalytics({
          userId: filters.userId,
          startDate: filters.startDate,
          endDate: filters.endDate,
          statusId: filters.statusId,
          periodType: filters.periodType,
        }),
      ).unwrap();

      // Загружаем историю
      await dispatch(
        fetchStatusHistory({
          userId: filters.userId,
          startDate: filters.startDate,
          endDate: filters.endDate,
          limit: 1000,
        }),
      ).unwrap();
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, filters, updateUrlParams]);

  const handleCloseError = () => {
    dispatch(clearError());
  };

  // Загружаем фильтры из URL при монтировании
  useEffect(() => {
    loadFiltersFromUrl();
  }, [loadFiltersFromUrl]);

  // Загружаем данные при изменении фильтров
  useEffect(() => {
    handleApplyFilters();
  }, [filters, handleApplyFilters]);

  return (
    <RequireSuperuser>
      <Layout>
        <PageWrapper>
          <Helmet>
            <title>Аналитика статусов</title>
          </Helmet>
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Аналитика статусов
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Детальная аналитика времени, проведенного пользователями в различных статусах
            </Typography>

            {/* Фильтры */}
            <StatusAnalyticsFilters onApplyFilters={handleApplyFilters} onFiltersChange={updateUrlParams} />

            {/* Вкладки */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
                <Tab
                  icon={<AnalyticsIcon />}
                  label="Аналитика"
                  id="analytics-tab-0"
                  aria-controls="analytics-tabpanel-0"
                />
                <Tab
                  icon={<HistoryIcon />}
                  label="История изменений"
                  id="analytics-tab-1"
                  aria-controls="analytics-tabpanel-1"
                />
              </Tabs>
            </Box>

            {/* Содержимое вкладок */}
            <TabPanel value={activeTab} index={0}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* Таймлайн - показываем только для одного пользователя за день */}
                  {filters.userId && filters.periodType === 'day' && <StatusTimeline />}
                  <StatusAnalyticsTable />
                </>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <StatusHistoryTable />
              )}
            </TabPanel>

            {/* Уведомления об ошибках */}
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          </Container>
        </PageWrapper>
      </Layout>
    </RequireSuperuser>
  );
});
