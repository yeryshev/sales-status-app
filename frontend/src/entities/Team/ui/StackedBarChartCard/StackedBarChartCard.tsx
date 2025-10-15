import { memo, useRef, useState, Fragment } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { ExpandChartButton } from '../ExpandChartButton';
import { FullScreenChartModal } from '../FullScreenChartModal';
import { calculateStackedYAxisMax } from '@/shared/lib/utils/chartUtils';

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
  isPercentageMode?: boolean;
}

export const StackedBarChartCard = memo((props: StackedBarChartCardProps) => {
  const { title, data, yAxisLabel = 'Количество', size = 'medium', isPercentageMode = false } = props;
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartTheme = useChartTheme();

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
          color: chartTheme.legendTextColor,
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
            const value = context.parsed.y;
            const suffix = isPercentageMode ? '%' : '';
            return `${context.dataset.label}: ${value}${suffix}`;
          },
        },
      },
      datalabels: {
        display: function (context: { datasetIndex: number; chart: ChartJS }) {
          // Показываем итоговые значения только для последнего видимого датасета в стеке
          const chart = context.chart;
          const visibleDatasetIndices = [];

          for (let i = 0; i < chart.data.datasets.length; i++) {
            if (!chart.getDatasetMeta(i).hidden) {
              visibleDatasetIndices.push(i);
            }
          }

          // Если это последний видимый датасет, показываем итоговую сумму
          return (
            visibleDatasetIndices.length > 0 &&
            context.datasetIndex === visibleDatasetIndices[visibleDatasetIndices.length - 1]
          );
        },
        color: chartTheme.dataLabelColor,
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 4,
        font: {
          weight: 'bold' as const,
          size: 11,
        },
        formatter: function (_value: number, context: { dataIndex: number; chart: ChartJS }) {
          // Вычисляем итоговое значение только для видимых датасетов
          const chart = context.chart;
          let total = 0;

          for (let i = 0; i < chart.data.datasets.length; i++) {
            if (!chart.getDatasetMeta(i).hidden) {
              const value = chart.data.datasets[i].data[context.dataIndex];
              total += typeof value === 'number' ? value : 0;
            }
          }

          // Добавляем символ '%' в процентном режиме
          if (isPercentageMode) {
            return `${total}%`;
          }
          return total;
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
          color: chartTheme.axisLabelColor,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: isPercentageMode ? 120 : calculateStackedYAxisMax(data), // В процентном режиме максимум 120%
        title: {
          display: true,
          text: isPercentageMode ? 'Доля (%)' : yAxisLabel,
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
          callback: function (value: string | number) {
            if (isPercentageMode) {
              return `${value}%`;
            }
            return value;
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
      <Card>
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, position: 'relative' }}
          >
            <Typography variant="h6">{title}</Typography>
            <ExpandChartButton onClick={() => setIsFullScreen(true)} title={`Раскрыть "${title}"`} inline />
          </Box>

          <Box sx={{ height: getCardHeight(), position: 'relative' }}>
            <Bar ref={chartRef} data={chartData} options={options} />
          </Box>
        </CardContent>
      </Card>

      <FullScreenChartModal open={isFullScreen} onClose={() => setIsFullScreen(false)} title={title}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </FullScreenChartModal>
    </Fragment>
  );
});
