import { memo } from 'react';
import { Alert, Box, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import {
  getWorkloadAnalyticsError,
  getWorkloadAnalyticsLoading,
  getWorkloadAnalyticsSummary,
} from '@/entities/StatusAnalytics';
import { WorkloadSummaryCards } from './WorkloadSummaryCards';
import { WorkloadDailyTrendChart } from './WorkloadDailyTrendChart';
import { WorkloadByUserChart } from './WorkloadByUserChart';

export const WorkloadAnalyticsSection = memo(() => {
  const summary = useAppSelector(getWorkloadAnalyticsSummary);
  const loading = useAppSelector(getWorkloadAnalyticsLoading);
  const error = useAppSelector(getWorkloadAnalyticsError);

  const hasData = (summary?.snapshotDays ?? 0) > 0 && (summary?.uniqueUsers ?? 0) > 0;
  const showUserComparison = (summary?.byUser.length ?? 0) > 1;
  const showDailyTrend = (summary?.byDay.length ?? 0) > 1;

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h5" component="h2" gutterBottom>
        Нагрузка на конец рабочего дня
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Снимок незавершённых задач в 16:00 UTC: первичные обращения, просроченные задачи, открытые чаты и назначенные
        тикеты
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : hasData ? (
        <>
          <WorkloadSummaryCards />
          {showDailyTrend && <WorkloadDailyTrendChart />}
          {showUserComparison && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <WorkloadByUserChart />
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <Alert severity="info">
          Пока нет снимков нагрузки за выбранный период. Данные начнут накапливаться после первого ежедневного снимка в
          16:00 UTC.
        </Alert>
      )}
    </Box>
  );
});
