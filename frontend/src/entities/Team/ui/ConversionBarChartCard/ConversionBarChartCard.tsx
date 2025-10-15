import { memo, useMemo, useState, Fragment } from 'react';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';
import { calculateYAxisMax } from '@/shared/lib/utils/chartUtils';
import { chartColors } from '@/shared/const/chartColors';
import { ExpandChartButton } from '../ExpandChartButton';
import { FullScreenChartModal } from '../FullScreenChartModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface ConversionBarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ConversionBarChartCardProps {
  title: string;
  data: ConversionBarChartDataPoint[];
  monthLabels: string[];
  isLoading?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  yAxisLabel?: string;
}

export const ConversionBarChartCard = memo((props: ConversionBarChartCardProps) => {
  const { title, data, monthLabels, isLoading, error, size = 'medium', yAxisLabel = 'Количество лидов' } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartTheme = useChartTheme();

  const chartData = useMemo(() => {
    if (!data.length) return null;

    // Группируем данные по типам (Получено лидов, Квалифицировано, Успешно реализовано)
    const receivedData = data.filter((_, index) => index % 3 === 0).map((item) => item.value);
    const qualifiedData = data.filter((_, index) => index % 3 === 1).map((item) => item.value);
    const successfulData = data.filter((_, index) => index % 3 === 2).map((item) => item.value);

    return {
      labels: monthLabels,
      datasets: [
        {
          label: 'Получено лидов',
          data: receivedData,
          backgroundColor: chartColors.conversionColors.received,
          borderColor: chartColors.conversionColors.received,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Квалифицировано',
          data: qualifiedData,
          backgroundColor: chartColors.conversionColors.qualified,
          borderColor: chartColors.conversionColors.qualified,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Успешно реализовано',
          data: successfulData,
          backgroundColor: chartColors.conversionColors.successful,
          borderColor: chartColors.conversionColors.successful,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [data, monthLabels]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          color: chartTheme.legendTextColor,
        },
      },
      tooltip: {
        backgroundColor: chartTheme.tooltipBackground,
        titleColor: chartTheme.tooltipTextColor,
        bodyColor: chartTheme.tooltipTextColor,
        borderColor: chartTheme.tooltipBorderColor,
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: chartTheme.dataLabelColor,
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 4,
        rotation: -90,
        font: {
          weight: 'bold' as const,
          size: 11,
        },
        formatter: function (value: number) {
          return value.toString();
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
        },
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
        max: calculateYAxisMax(data.map((item) => item.value)), // Максимальное значение с правильным округлением
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
        return { minHeight: 200, p: 2 };
      case 'large':
        return { minHeight: 500, p: 3 };
      default:
        return { minHeight: 280, p: 2.5 };
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
    <Fragment>
      <Paper elevation={2} sx={{ ...getSizeStyles() }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{title}</Typography>
            <ExpandChartButton onClick={() => setIsFullScreen(true)} title={`Раскрыть "${title}"`} inline />
          </Box>

          <Box sx={{ height: getChartHeight(), position: 'relative' }}>
            <Bar data={chartData} options={options} />
          </Box>
        </Box>
      </Paper>

      <FullScreenChartModal open={isFullScreen} onClose={() => setIsFullScreen(false)} title={title}>
        <Bar data={chartData} options={options} />
      </FullScreenChartModal>
    </Fragment>
  );
});
