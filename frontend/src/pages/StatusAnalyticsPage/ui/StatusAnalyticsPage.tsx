import { memo, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
  Button,
  Collapse,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import {
  fetchStatusAnalytics,
  fetchStatusHistory,
  fetchDateRange,
  getStatusAnalyticsError,
  getStatusAnalyticsFilters,
  clearError,
  setFilters,
  isSingleDayPeriod,
  calculatePeriodDates,
  type PeriodType,
} from '@/entities/StatusAnalytics';
import { getUserData } from '@/entities/User';
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
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const StatusAnalyticsPage = memo(() => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(getUserData);
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const error = useAppSelector(getStatusAnalyticsError);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Функция для обновления URL параметров
  const updateUrlParams = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const params = new URLSearchParams();

      if (newFilters.userId) params.set('userId', newFilters.userId.toString());
      if (newFilters.statusId) params.set('statusId', newFilters.statusId.toString());
      if (newFilters.departmentId) params.set('departmentId', newFilters.departmentId);
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
    const departmentId = searchParams.get('departmentId') as 'managers' | 'account_managers' | 'customer_care' | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const periodType = searchParams.get('periodType') as PeriodType | null;

    // Если есть параметры в URL, загружаем их
    if (userId || statusId || departmentId || startDate || endDate || periodType) {
      // Получаем текущую дату в Московском времени для fallback
      const defaultPeriod = calculatePeriodDates('today');

      dispatch(
        setFilters({
          userId: userId ? parseInt(userId) : undefined,
          statusId: statusId ? parseInt(statusId) : undefined,
          departmentId: departmentId || undefined,
          startDate: startDate || defaultPeriod.startDate,
          endDate: endDate || defaultPeriod.endDate,
          periodType: periodType || 'today',
        }),
      );
    } else {
      // Если параметров нет, сбрасываем к значениям по умолчанию и очищаем URL
      const defaultPeriod = calculatePeriodDates('today');

      dispatch(
        setFilters({
          userId: undefined,
          statusId: undefined,
          departmentId: undefined,
          startDate: defaultPeriod.startDate,
          endDate: defaultPeriod.endDate,
          periodType: 'today',
        }),
      );

      // Очищаем URL параметры
      setSearchParams({});
    }
  }, [searchParams, dispatch, setSearchParams]);

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
          departmentId: filters.departmentId,
        }),
      ).unwrap();

      // Загружаем историю
      // Для таймлайна (однодневные периоды) нужна вся история пользователя
      const isSingleDay = isSingleDayPeriod(filters.periodType, filters.startDate, filters.endDate);
      const historyStartDate = isSingleDay ? undefined : filters.startDate;
      const historyEndDate = isSingleDay ? undefined : filters.endDate;

      await dispatch(
        fetchStatusHistory({
          userId: filters.userId,
          startDate: historyStartDate,
          endDate: historyEndDate,
          limit: 1000,
          departmentId: filters.departmentId,
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

  // Загружаем фильтры из URL и диапазон дат при монтировании
  useEffect(() => {
    if (userData?.isSuperuser) {
      loadFiltersFromUrl();
      dispatch(fetchDateRange());

      // Загружаем данные после небольшой задержки, чтобы фильтры успели установиться
      setTimeout(() => {
        setIsInitialized(true);
      }, 50);
    }
  }, [loadFiltersFromUrl, userData?.isSuperuser, dispatch]);

  // Загружаем данные при изменении фильтров с debounce (только после инициализации)
  useEffect(() => {
    if (!userData?.isSuperuser || !isInitialized) return;

    const timeoutId = setTimeout(() => {
      handleApplyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, handleApplyFilters, userData?.isSuperuser, isInitialized]);

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
            <StatusAnalyticsFilters onFiltersChange={updateUrlParams} />

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
                  {/* Таймлайн - показываем для пользователя или отдела за однодневный период */}
                  {(filters.userId || filters.departmentId) &&
                    isSingleDayPeriod(filters.periodType, filters.startDate, filters.endDate) && <StatusTimeline />}

                  {/* Таблица аналитики - сворачиваемая, если есть таймлайн */}
                  {(filters.userId || filters.departmentId) &&
                  isSingleDayPeriod(filters.periodType, filters.startDate, filters.endDate) ? (
                    <Box>
                      <Button
                        onClick={() => setIsTableExpanded(!isTableExpanded)}
                        startIcon={isTableExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ mb: 2 }}
                        variant="outlined"
                        fullWidth
                      >
                        {isTableExpanded ? 'Скрыть таблицу аналитики' : 'Показать таблицу аналитики'}
                      </Button>
                      <Collapse in={isTableExpanded}>
                        <StatusAnalyticsTable />
                      </Collapse>
                    </Box>
                  ) : (
                    <StatusAnalyticsTable />
                  )}
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
