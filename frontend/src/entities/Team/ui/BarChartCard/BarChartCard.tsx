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
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';

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
  const chartTheme = useChartTheme();
  const theme = useTheme();

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
        backgroundColor: chartTheme.tooltipBackground,
        titleColor: chartTheme.tooltipTextColor,
        bodyColor: chartTheme.tooltipTextColor,
        borderColor: chartTheme.tooltipBorderColor,
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
          color: chartTheme.axisLabelColor,
        },
        grid: {
          color: chartTheme.gridColor,
        },
        ticks: {
          maxRotation: horizontal ? 0 : 45,
          font: {
            size: 11,
          },
          color: chartTheme.axisLabelColor,
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
          color: chartTheme.axisLabelColor,
        },
        grid: {
          color: chartTheme.gridColor,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: chartTheme.axisLabelColor,
        },
      },
    },
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { minHeight: 200, padding: 2 };
      case 'large':
        return { minHeight: 500, padding: 3 };
      default:
        return { minHeight: 280, padding: 2.5 };
    }
  };

  const getChartHeight = () => {
    switch (size) {
      case 'small':
        return 200;
      case 'large':
        return 450;
      default:
        return 300;
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

        <Box sx={{ height: getChartHeight(), position: 'relative' }}>
          <Bar data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
});
