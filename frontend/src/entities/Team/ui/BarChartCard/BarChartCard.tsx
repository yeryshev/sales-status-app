import { memo, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartCardProps {
  title: string;
  data: BarChartDataPoint[];
  isLoading?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  yAxisLabel?: string;
  horizontal?: boolean;
}

export const BarChartCard = memo((props: BarChartCardProps) => {
  const { title, data, isLoading, error, size = 'medium', yAxisLabel = 'Значение', horizontal = false } = props;

  const chartData = useMemo(() => {
    if (!data.length) return null;

    const colors = data.map((item, index) => item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`);

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: title,
          data: data.map((item) => item.value),
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [data, title]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#1976d2',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.y || context.parsed.x}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: !horizontal,
          text: horizontal ? 'Значение' : yAxisLabel,
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: horizontal ? 0 : 45,
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: horizontal,
          text: horizontal ? yAxisLabel : 'Категория',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
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
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        border: '1px solid #e0e0e0',
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
          <Bar data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
});
