import { memo, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartDataPoint {
  label: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  data: LineChartDataPoint[];
  color?: string;
  isLoading?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  yAxisLabel?: string;
}

export const LineChartCard = memo((props: LineChartCardProps) => {
  const { title, data, color = '#1976d2', isLoading, error, size = 'medium', yAxisLabel = 'Значение' } = props;
  const chartTheme = useChartTheme();
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!data.length) return null;

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: title,
          data: data.map((item) => item.value),
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: chartTheme.pointBorderColor,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data, title, color, chartTheme.pointBorderColor]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: chartTheme.tooltipBackground,
        titleColor: chartTheme.tooltipTextColor,
        bodyColor: chartTheme.tooltipTextColor,
        borderColor: chartTheme.tooltipBorderColor,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11,
          },
          color: chartTheme.axisLabelColor,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            size: 12,
          },
          color: chartTheme.axisLabelColor,
        },
        grid: {
          color: chartTheme.gridColor,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { minHeight: 200, padding: 2 };
      case 'large':
        return { minHeight: 350, padding: 3 };
      default:
        return { minHeight: 280, padding: 2.5 };
    }
  };

  if (isLoading) {
    return (
      <Paper
        elevation={2}
        sx={{
          ...getSizeStyles(),
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">Загрузка...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={2}
        sx={{
          ...getSizeStyles(),
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!chartData) {
    return (
      <Paper
        elevation={2}
        sx={{
          ...getSizeStyles(),
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Нет данных для отображения
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        ...getSizeStyles(),
        borderRadius: 3,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #424242 0%, #303030 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flex: 1, position: 'relative' }}>
          <Line data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
});
