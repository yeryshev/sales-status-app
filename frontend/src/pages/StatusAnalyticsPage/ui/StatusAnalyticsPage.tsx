import { memo, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, Alert, Snackbar, CircularProgress, Container, Grid, Paper } from '@mui/material';
import { Analytics as AnalyticsIcon, History as HistoryIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import {
  fetchStatusAnalyticsSummary,
  fetchStatusHistory,
  fetchDateRange,
  fetchWorkloadAnalyticsSummary,
  fetchWorkloadDateRange,
  getStatusAnalyticsError,
  getStatusAnalyticsFilters,
  getStatusAnalyticsSummary,
  getStatusAnalyticsDateRange,
  clearError,
  setFilters,
  isSingleDayPeriod,
  calculatePeriodDates,
  getPeriodLabel,
  subtractDaysFromDateString,
  type PeriodType,
} from '@/entities/StatusAnalytics';
import { getUserData } from '@/entities/User';
import { RequireSuperuser } from '@/shared/lib/components/RequireSuperuser';
import { Layout } from '@/widgets/Layout';
import { PageWrapper } from '@/shared/ui/PageWrapper';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { StatusAnalyticsFilters } from './StatusAnalyticsFilters';
import { StatusHistoryTable } from './StatusHistoryTable';
import { StatusTimeline } from './StatusTimeline';
import { StatusAnalyticsSummaryCards } from './StatusAnalyticsSummaryCards';
import { StatusDistributionChart } from './StatusDistributionChart';
import { StatusByUserChart } from './StatusByUserChart';
import { StatusDailyTrendChart } from './StatusDailyTrendChart';
import { WorkloadAnalyticsSection } from './WorkloadAnalyticsSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
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

const DEPARTMENT_LABELS: Record<string, string> = {
  managers: 'Входящие продажи',
  account_managers: 'Аккаунт-менеджеры',
  customer_care: 'Customer Care',
};

const HISTORY_LIMIT = 500;
const TIMELINE_HISTORY_LOOKBACK_DAYS = 7;

export const StatusAnalyticsPage = memo(() => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(getUserData);
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const summary = useAppSelector(getStatusAnalyticsSummary);
  const dateRange = useAppSelector(getStatusAnalyticsDateRange);
  const error = useAppSelector(getStatusAnalyticsError);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const isSingleDay = isSingleDayPeriod(filters.periodType, filters.startDate, filters.endDate);
  const showTimeline = Boolean(filters.userId || filters.departmentId) && isSingleDay;
  const showUserComparison = !filters.userId && (summary?.byUser.length ?? 0) > 1;
  const showDailyTrend = !isSingleDay && (summary?.byDay.length ?? 0) > 1;

  const buildWorkloadRequest = useCallback(
    () => ({
      userId: filters.userId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      departmentId: filters.departmentId,
    }),
    [filters],
  );

  const buildAnalyticsRequest = useCallback(
    () => ({
      userId: filters.userId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      statusId: filters.statusId,
      periodType: filters.periodType,
      departmentId: filters.departmentId,
    }),
    [filters],
  );

  const buildHistoryParams = useCallback(
    (forTimeline: boolean) => {
      if (forTimeline && isSingleDay) {
        return {
          userId: filters.userId,
          startDate: subtractDaysFromDateString(filters.startDate, TIMELINE_HISTORY_LOOKBACK_DAYS),
          endDate: filters.endDate,
          limit: HISTORY_LIMIT,
          departmentId: filters.departmentId,
        };
      }
      return {
        userId: filters.userId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: HISTORY_LIMIT,
        departmentId: filters.departmentId,
      };
    },
    [filters, isSingleDay],
  );

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

  const loadFiltersFromUrl = useCallback(() => {
    const userId = searchParams.get('userId');
    const statusId = searchParams.get('statusId');
    const departmentId = searchParams.get('departmentId') as 'managers' | 'account_managers' | 'customer_care' | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const periodType = searchParams.get('periodType') as PeriodType | null;
    const defaultPeriod = calculatePeriodDates('today');

    if (userId || statusId || departmentId || startDate || endDate || periodType) {
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
      setSearchParams({});
    }
  }, [searchParams, dispatch, setSearchParams]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      updateUrlParams(filters);
      const request = buildAnalyticsRequest();
      const workloadRequest = buildWorkloadRequest();
      await Promise.allSettled([
        dispatch(fetchStatusAnalyticsSummary(request)).unwrap(),
        dispatch(fetchWorkloadAnalyticsSummary(workloadRequest)).unwrap(),
      ]);

      if (showTimeline) {
        await dispatch(fetchStatusHistory(buildHistoryParams(true))).unwrap();
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    filters,
    updateUrlParams,
    buildAnalyticsRequest,
    buildWorkloadRequest,
    showTimeline,
    buildHistoryParams,
  ]);

  const loadHistoryTabData = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(fetchStatusHistory(buildHistoryParams(false))).unwrap();
    } catch (err) {
      console.error('Ошибка загрузки истории:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, buildHistoryParams]);

  useEffect(() => {
    if (userData?.isSuperuser) {
      loadFiltersFromUrl();
      dispatch(fetchDateRange());
      dispatch(fetchWorkloadDateRange());
      setTimeout(() => setIsInitialized(true), 50);
    }
  }, [loadFiltersFromUrl, userData?.isSuperuser, dispatch]);

  useEffect(() => {
    if (filters.periodType !== 'allTime' || !dateRange?.minDate || !dateRange?.maxDate) return;

    const { startDate, endDate } = calculatePeriodDates('allTime', dateRange);
    if (filters.startDate !== startDate || filters.endDate !== endDate) {
      dispatch(setFilters({ startDate, endDate }));
    }
  }, [filters.periodType, filters.startDate, filters.endDate, dateRange, dispatch]);

  useEffect(() => {
    if (!userData?.isSuperuser || !isInitialized) return;
    const timeoutId = setTimeout(() => loadDashboardData(), 300);
    return () => clearTimeout(timeoutId);
  }, [filters, loadDashboardData, userData?.isSuperuser, isInitialized]);

  useEffect(() => {
    if (!userData?.isSuperuser || !isInitialized || activeTab !== 1) return;
    const timeoutId = setTimeout(() => loadHistoryTabData(), 100);
    return () => clearTimeout(timeoutId);
  }, [activeTab, filters, loadHistoryTabData, userData?.isSuperuser, isInitialized]);

  const contextLabel = filters.userId
    ? summary?.byUser.find((user) => user.userId === filters.userId)?.userName || 'Сотрудник'
    : filters.departmentId
      ? DEPARTMENT_LABELS[filters.departmentId]
      : 'Все отделы';

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
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Статистика времени в статусах и незавершённых задач на конец рабочего дня
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {contextLabel} · {getPeriodLabel(filters.periodType)}
              {filters.periodType === 'custom' && ` (${filters.startDate} — ${filters.endDate})`}
            </Typography>

            <StatusAnalyticsFilters onFiltersChange={updateUrlParams} />

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={(_e, value) => setActiveTab(value)}>
                <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Дашборд" />
                <Tab icon={<HistoryIcon />} iconPosition="start" label="История изменений" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {summary && summary.segmentCount > 0 ? (
                    <>
                      <StatusAnalyticsSummaryCards />

                      {showDailyTrend && <StatusDailyTrendChart />}

                      {showTimeline && <StatusTimeline />}

                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={showUserComparison ? 5 : 12}>
                          <StatusDistributionChart />
                        </Grid>
                        {showUserComparison && (
                          <Grid item xs={12} md={7}>
                            <StatusByUserChart />
                          </Grid>
                        )}
                      </Grid>
                    </>
                  ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Нет данных по статусам за выбранный период
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Измените фильтры или выберите другой диапазон дат
                      </Typography>
                    </Paper>
                  )}

                  <WorkloadAnalyticsSection />
                </>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <StatusHistoryTable />
              )}
            </TabPanel>

            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => dispatch(clearError())}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={() => dispatch(clearError())} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          </Container>
        </PageWrapper>
      </Layout>
    </RequireSuperuser>
  );
});
