import { memo, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalyticsSummary, getStatusAnalyticsFilters } from '@/entities/StatusAnalytics';
import { getStatusChartColor, isOfflineStatus } from '@/entities/StatusAnalytics';
import { formatDurationFromSeconds } from '@/entities/StatusAnalytics';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

export const StatusDistributionChart = memo(() => {
  const summary = useAppSelector(getStatusAnalyticsSummary);
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const theme = useTheme();
  const chartTheme = useChartTheme();

  const showAveragePerUser = !filters.userId && (summary?.uniqueUsers ?? 0) > 1;

  const activeStatuses = useMemo(() => {
    if (!summary) return [];

    if (showAveragePerUser && summary.byUserStatus.length > 0) {
      const userCount = summary.byUserStatus.length;
      const statusMeta = new Map<number, string>();

      summary.byUserStatus.forEach((userRow) => {
        userRow.statuses.forEach((status) => {
          statusMeta.set(status.statusId, status.statusTitle);
        });
      });

      return Array.from(statusMeta.entries())
        .filter(([statusId, statusTitle]) => !isOfflineStatus(statusId, statusTitle))
        .map(([statusId, statusTitle]) => {
          const totalSeconds = summary.byUserStatus.reduce((sum, userRow) => {
            const match = userRow.statuses.find((status) => status.statusId === statusId);
            return sum + (match?.durationSeconds ?? 0);
          }, 0);
          const durationSeconds = Math.round(totalSeconds / userCount);

          return {
            statusId,
            statusTitle,
            durationSeconds,
            durationHours: Math.round((durationSeconds / 3600) * 100) / 100,
          };
        })
        .filter((item) => item.durationSeconds > 0)
        .sort((a, b) => b.durationSeconds - a.durationSeconds);
    }

    if (!summary.byStatus.length) return [];

    return summary.byStatus
      .filter((item) => !isOfflineStatus(item.statusId, item.statusTitle))
      .map((item) => ({
        statusId: item.statusId,
        statusTitle: item.statusTitle,
        durationSeconds: item.durationSeconds,
        durationHours: item.durationHours,
      }));
  }, [summary, showAveragePerUser]);

  const chartData = useMemo(() => {
    if (!activeStatuses.length) return null;

    const totalActiveSeconds = activeStatuses.reduce((sum, item) => sum + item.durationSeconds, 0);

    return {
      items: activeStatuses.map((item) => ({
        ...item,
        percentage: totalActiveSeconds > 0 ? Math.round((item.durationSeconds / totalActiveSeconds) * 1000) / 10 : 0,
      })),
      labels: activeStatuses.map((item) => item.statusTitle),
      datasets: [
        {
          data: activeStatuses.map((item) => item.durationHours),
          backgroundColor: activeStatuses.map((item) => getStatusChartColor(item.statusId, 0, theme)),
          borderWidth: 2,
          borderColor: theme.palette.background.paper,
        },
      ],
    };
  }, [activeStatuses, theme]);

  if (!chartData) {
    return (
      <Paper sx={{ p: 3, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Нет данных для распределения</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Распределение по статусам
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {showAveragePerUser
          ? summary?.isAveraged
            ? 'Среднее за рабочий день на сотрудника (без дней полного оффлайна). Работа и встречи — зелёный, обед и отошёл — синий.'
            : 'Среднее время на сотрудника. Работа и встречи — зелёный, обед и отошёл — синий.'
          : summary?.isAveraged
            ? 'Среднее за рабочий день (без дней полного оффлайна). Работа и встречи — зелёный, обед и отошёл — синий.'
            : 'Активное время: работа и встречи (зелёный), обед и отошёл (синий). Оффлайн не показан.'}
      </Typography>
      <Box sx={{ height: 300, position: 'relative' }}>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: chartTheme.legendTextColor,
                  usePointStyle: true,
                  padding: 12,
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const item = chartData.items[context.dataIndex];
                    return `${item.statusTitle}: ${formatDurationFromSeconds(item.durationSeconds)} (${item.percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
});
