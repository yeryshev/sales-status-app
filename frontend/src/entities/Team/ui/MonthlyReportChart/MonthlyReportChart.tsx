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
import { Box, Typography, CircularProgress } from '@mui/material';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';
import { chartColors } from '@/shared/const/chartColors';
import { ProcessedChartData } from '../../model/types/monthlyReport';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlyReportChartProps {
  data: ProcessedChartData;
  isLoading: boolean;
  error?: string;
}

const generateColors = (count: number) => {
  return chartColors.managerColors.slice(0, count);
};

export const MonthlyReportChart = memo((props: MonthlyReportChartProps) => {
  const { data, isLoading, error } = props;
  const chartTheme = useChartTheme();

  const chartData = useMemo(() => {
    if (!data.data.length) return null;

    const colors = generateColors(data.managers.length);

    const datasets = data.managers.map((manager, index) => ({
      label: manager,
      data: data.data.map((point) => point.managers[manager] || 0),
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderWidth: 1,
      stack: 'Stack 0', // Группируем все датасеты в один стек
    }));

    return {
      labels: data.data.map((point) => point.month),
      datasets,
    };
  }, [data]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: chartTheme.legendTextColor,
        },
      },
      title: {
        display: true,
        text: 'Количество полученных лидов по менеджерам',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: chartTheme.titleColor,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          afterBody: (context: { dataIndex: number }[]) => {
            const dataIndex = context[0].dataIndex;
            const total = data.data[dataIndex]?.total || 0;
            return `Общий итог: ${total}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Месяц и год',
          color: chartTheme.axisLabelColor,
        },
        ticks: {
          color: chartTheme.axisLabelColor,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Количество лидов',
          color: chartTheme.axisLabelColor,
        },
        beginAtZero: true,
        ticks: {
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error" variant="h6">
          Ошибка загрузки данных: {error}
        </Typography>
      </Box>
    );
  }

  if (!chartData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="text.secondary">
          Нет данных для отображения
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '500px' }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
});
