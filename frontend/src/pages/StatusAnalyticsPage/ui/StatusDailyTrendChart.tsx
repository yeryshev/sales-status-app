import { memo, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalyticsSummary, getStatusAnalyticsFilters } from '@/entities/StatusAnalytics';
import { getStatusChartColor, isOfflineStatus } from '@/entities/StatusAnalytics';
import { formatDurationFromHours, formatShortDate } from '@/entities/StatusAnalytics';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

export const StatusDailyTrendChart = memo(() => {
  const summary = useAppSelector(getStatusAnalyticsSummary);
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const theme = useTheme();
  const chartTheme = useChartTheme();

  const showAveragePerUser = !filters.userId && (summary?.uniqueUsers ?? 0) > 1;

  const chartData = useMemo(() => {
    if (!summary?.byDay.length) return null;

    const statusTitles = new Map<number, string>();
    summary.byDay.forEach((day) => {
      day.statuses.forEach((status) => {
        statusTitles.set(status.statusId, status.statusTitle);
      });
    });

    const statusIds = Array.from(
      new Set(summary.byDay.flatMap((day) => day.statuses.map((status) => status.statusId))),
    ).filter((statusId) => !isOfflineStatus(statusId, statusTitles.get(statusId)));

    if (statusIds.length === 0) return null;

    return {
      labels: summary.byDay.map((day) => formatShortDate(day.date)),
      statusIds,
      datasets: statusIds.map((statusId, index) => ({
        label: statusTitles.get(statusId) || `Статус ${statusId}`,
        data: summary.byDay.map((day) => {
          const match = day.statuses.find((status) => status.statusId === statusId);
          if (!match) return 0;
          if (showAveragePerUser && day.userCount > 0) {
            return Math.round((match.durationHours / day.userCount) * 100) / 100;
          }
          return match.durationHours;
        }),
        backgroundColor: getStatusChartColor(statusId, index, theme),
        stack: 'statuses',
        borderRadius: 2,
      })),
      rawByDay: summary.byDay,
    };
  }, [summary, theme, showAveragePerUser]);

  if (!chartData || chartData.labels.length <= 1) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Динамика по дням
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {showAveragePerUser
          ? 'Среднее активное время на сотрудника (работа, встречи, обед, отошёл). Оффлайн не показан.'
          : 'Активное время по статусам (работа, встречи, обед, отошёл). Оффлайн не показан.'}
      </Typography>
      <Box sx={{ height: 380 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: chartTheme.legendTextColor, usePointStyle: true },
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => {
                    const day = chartData.rawByDay[context.dataIndex];
                    const statusId = chartData.statusIds[context.datasetIndex];
                    const match = day.statuses.find((s) => s.statusId === statusId);
                    const hours = context.parsed.y ?? 0;
                    const lines = [`${context.dataset.label}: ${formatDurationFromHours(hours)}`];
                    if (showAveragePerUser && match && day.userCount > 0) {
                      lines.push(`Сумма по отделу: ${formatDurationFromHours(match.durationHours)}`);
                      lines.push(`Сотрудников: ${day.userCount}`);
                    }
                    return lines;
                  },
                },
              },
              datalabels: {
                display: false,
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: { display: false },
                ticks: { color: chartTheme.axisLabelColor },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                grid: { color: chartTheme.gridColor },
                ticks: {
                  color: chartTheme.axisLabelColor,
                  callback: (value) => formatDurationFromHours(Number(value)),
                },
                title: {
                  display: true,
                  text: showAveragePerUser ? 'Среднее на сотрудника' : 'Время',
                  color: chartTheme.axisLabelColor,
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
});
