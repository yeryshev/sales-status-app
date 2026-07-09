import { memo, useMemo, useState } from 'react';
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '@/shared/lib/hooks';
import {
  getWorkloadAnalyticsSummary,
  WORKLOAD_METRICS,
  WorkloadMetricKey,
  formatWorkloadValue,
  getWorkloadMetricValue,
} from '@/entities/StatusAnalytics';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const WorkloadByUserChart = memo(() => {
  const summary = useAppSelector(getWorkloadAnalyticsSummary);
  const chartTheme = useChartTheme();
  const [metricKey, setMetricKey] = useState<WorkloadMetricKey>('overdueTasks');

  const metric = WORKLOAD_METRICS.find((item) => item.key === metricKey) ?? WORKLOAD_METRICS[1];

  const chartData = useMemo(() => {
    if (!summary?.byUser.length) return null;

    const users = summary.byUser
      .map((user) => ({
        userName: user.userName,
        value: getWorkloadMetricValue(user.averages, metricKey),
      }))
      .filter((user) => user.value !== null)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      .slice(0, 15);

    if (!users.length) return null;

    return {
      labels: users.map((user) => user.userName),
      values: users.map((user) => user.value ?? 0),
    };
  }, [summary, metricKey]);

  if (!summary?.byUser.length) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Сравнение сотрудников
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Среднее значение на конец рабочего дня (16:00 UTC) за выбранный период
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          value={metricKey}
          exclusive
          onChange={(_event, value: WorkloadMetricKey | null) => {
            if (value) setMetricKey(value);
          }}
          sx={{ flexWrap: 'wrap' }}
        >
          {WORKLOAD_METRICS.map((item) => (
            <ToggleButton key={item.key} value={item.key}>
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {!chartData ? (
        <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Нет данных по выбранной метрике</Typography>
        </Box>
      ) : (
        <Box sx={{ height: Math.max(300, chartData.labels.length * 36) }}>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: metric.label,
                  data: chartData.values,
                  backgroundColor: metric.color,
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => `${metric.label}: ${formatWorkloadValue(context.parsed.x)}`,
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  grid: { color: chartTheme.gridColor },
                  ticks: { color: chartTheme.axisLabelColor, precision: 0 },
                  title: {
                    display: true,
                    text: 'Среднее за период',
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
      )}
    </Paper>
  );
});
