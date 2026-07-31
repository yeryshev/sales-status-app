import { memo, useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from '@/shared/lib/hooks';
import {
  getWorkloadAnalyticsSummary,
  WORKLOAD_METRICS,
  formatWorkloadValue,
  getWorkloadMetricValue,
  formatShortDate,
} from '@/entities/StatusAnalytics';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const WorkloadDailyTrendChart = memo(() => {
  const summary = useAppSelector(getWorkloadAnalyticsSummary);
  const chartTheme = useChartTheme();

  const chartData = useMemo(() => {
    if (!summary?.byDay.length || summary.byDay.length <= 1) return null;

    const datasets = WORKLOAD_METRICS.map((metric) => ({
      label: metric.label,
      data: summary.byDay.map((day) => getWorkloadMetricValue(day.averages, metric.key)),
      borderColor: metric.color,
      backgroundColor: metric.color,
      tension: 0.25,
      spanGaps: true,
    })).filter((dataset) => dataset.data.some((value) => value !== null));

    if (!datasets.length) return null;

    return {
      labels: summary.byDay.map((day) => formatShortDate(day.date)),
      datasets,
    };
  }, [summary]);

  if (!chartData) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Динамика нагрузки по дням
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Средние значения на конец рабочего дня по всем сотрудникам в выборке
      </Typography>
      <Box sx={{ height: 380 }}>
        <Line
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
                  label: (context) => `${context.dataset.label}: ${formatWorkloadValue(context.parsed.y)}`,
                },
              },
              datalabels: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: chartTheme.axisLabelColor },
              },
              y: {
                beginAtZero: true,
                grid: { color: chartTheme.gridColor },
                ticks: { color: chartTheme.axisLabelColor, precision: 0 },
                title: {
                  display: true,
                  text: 'Среднее значение',
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
