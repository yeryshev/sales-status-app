import { memo, useRef, useState, Fragment } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { ExpandChartButton } from '../ExpandChartButton';
import { FullScreenChartModal } from '../FullScreenChartModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface StackedBarDataPoint {
  label: string;
  datasets: {
    label: string;
    data: number;
    backgroundColor: string;
  }[];
}

interface StackedBarChartCardProps {
  title: string;
  data: StackedBarDataPoint[];
  yAxisLabel?: string;
  size?: 'small' | 'medium' | 'large';
}

export const StackedBarChartCard = memo((props: StackedBarChartCardProps) => {
  const { title, data, yAxisLabel = 'Количество', size = 'medium' } = props;
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Вычисляем итоговые значения для каждого столбца
  const totalValues = data.map((item) => item.datasets.reduce((sum, dataset) => sum + dataset.data, 0));

  const chartData = {
    labels: data.map((item) => item.label),
    datasets:
      data[0]?.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: data.map((item) => item.datasets[index]?.data || 0),
        backgroundColor: dataset.backgroundColor,
        stack: 'Stack 0',
      })) || [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
      datalabels: {
        display: function (context: { datasetIndex: number }) {
          // Показываем только итоговые значения (для последнего датасета в стеке)
          return context.datasetIndex === chartData.datasets.length - 1;
        },
        color: '#333',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 4,
        font: {
          weight: 'bold' as const,
          size: 11,
        },
        formatter: function (_value: number, context: { dataIndex: number }) {
          // Возвращаем итоговое значение для столбца
          return totalValues[context.dataIndex];
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: Math.max(...totalValues) * 1.2, // Максимальное значение на 20% больше максимального значения данных
        title: {
          display: true,
          text: yAxisLabel,
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
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const getCardHeight = () => {
    switch (size) {
      case 'small':
        return 300;
      case 'large':
        return 500;
      default:
        return 400;
    }
  };

  return (
    <Fragment>
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.1rem',
            }}
          >
            {title}
          </Typography>

          <Box sx={{ height: getCardHeight(), position: 'relative' }}>
            <Bar ref={chartRef} data={chartData} options={options} />
            <ExpandChartButton onClick={() => setIsFullScreen(true)} title={`Раскрыть "${title}"`} />
          </Box>
        </CardContent>
      </Card>

      <FullScreenChartModal open={isFullScreen} onClose={() => setIsFullScreen(false)} title={title}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </FullScreenChartModal>
    </Fragment>
  );
});
