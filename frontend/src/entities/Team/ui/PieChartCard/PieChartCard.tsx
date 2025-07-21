import { memo, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  data: PieChartData[];
  isLoading?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
}

export const PieChartCard = memo((props: PieChartCardProps) => {
  const { title, data, isLoading, error, size = 'medium' } = props;

  const chartData = useMemo(() => {
    if (!data.length) return null;

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: data.map((item) => item.color),
          borderColor: data.map((item) => item.color),
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
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
          <Pie data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
});
