import { memo, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalyticsSummary } from '@/entities/StatusAnalytics';
import { formatDurationFromHours } from '@/entities/StatusAnalytics';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** работаю + встреча */
const PRODUCTIVE_STATUS_IDS = [1, 7];

export const StatusByUserChart = memo(() => {
  const summary = useAppSelector(getStatusAnalyticsSummary);
  const theme = useTheme();
  const chartTheme = useChartTheme();

  const chartData = useMemo(() => {
    if (!summary?.byUserStatus.length) return null;

    const usersWithProductiveHours = summary.byUserStatus
      .map((userRow) => ({
        userName: userRow.userName,
        productiveHours: userRow.statuses
          .filter((status) => PRODUCTIVE_STATUS_IDS.includes(status.statusId))
          .reduce((sum, status) => sum + status.durationHours, 0),
      }))
      .filter((user) => user.productiveHours > 0)
      .sort((a, b) => b.productiveHours - a.productiveHours)
      .slice(0, 15);

    if (!usersWithProductiveHours.length) return null;

    return {
      labels: usersWithProductiveHours.map((user) => user.userName),
      datasets: [
        {
          label: 'Работа и встречи',
          data: usersWithProductiveHours.map((user) => user.productiveHours),
          backgroundColor: theme.palette.success.main,
          borderRadius: 4,
        },
      ],
    };
  }, [summary, theme]);

  if (!chartData) {
    return (
      <Paper sx={{ p: 3, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Нет данных по сотрудникам</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Сравнение сотрудников
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {summary?.isAveraged
          ? 'Среднее за рабочий день: «работаю» + «встреча» (без выходных и дней полного оффлайна)'
          : 'Суммарно: «работаю» + «встреча»'}
      </Typography>
      <Box sx={{ height: Math.max(300, chartData.labels.length * 36) }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${formatDurationFromHours(context.parsed.x ?? 0)}`,
                },
              },
            },
            scales: {
              x: {
                stacked: false,
                grid: { color: chartTheme.gridColor },
                ticks: { color: chartTheme.axisLabelColor },
                title: {
                  display: true,
                  text: summary?.isAveraged ? 'Среднее, ч/раб. день' : 'Часы',
                  color: chartTheme.axisLabelColor,
                },
              },
              y: {
                grid: { display: false },
                ticks: { color: chartTheme.axisLabelColor },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
});
