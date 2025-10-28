import { memo, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';
import { useChartTheme } from '@/shared/lib/hooks/useChartTheme';
import { calculateStackedYAxisMax } from '@/shared/lib/utils/chartUtils';

import { ExpandChartButton } from '../ExpandChartButton';
import { FullScreenChartModal } from '../FullScreenChartModal';
import { ManagerData } from '../../model/types/monthlyReport';
import { getDepartmentPlan } from '../../lib/monthlyReportHelpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

interface DepartmentPlanChartProps {
  data: ManagerData[];
  size?: 'small' | 'medium' | 'large';
  isPercentageMode?: boolean;
  isAccountManagersRoute?: boolean;
}

export const DepartmentPlanChart = memo((props: DepartmentPlanChartProps) => {
  const { data, size = 'medium', isPercentageMode = false, isAccountManagersRoute = false } = props;
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartTheme = useChartTheme();

  // Получаем план отдела в зависимости от маршрута
  const departmentPlan = getDepartmentPlan(isAccountManagersRoute);

  // Создаем данные в формате, совместимом с calculateStackedYAxisMax
  const stackedDataForMax = data.map((item) => ({
    datasets: item.datasets,
  }));

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      ...(data[0]?.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: data.map((item) => item.datasets[index]?.data || 0),
        backgroundColor: dataset.backgroundColor,
        stack: 'Stack 0',
      })) || []),
    ],
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
          label: function (context: { parsed: { y: number }; dataset: { label?: string } }) {
            const value = context.parsed.y;
            if (isPercentageMode) {
              return `${context.dataset.label}: ${value}%`;
            } else {
              return `${context.dataset.label}: ${value.toLocaleString('ru-RU')} ₽`;
            }
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

          if (isPercentageMode) {
            return `${total}%`;
          } else {
            return total.toLocaleString('ru-RU');
          }
        },
      },
      annotation: {
        annotations: {
          planLine: {
            type: 'line' as const,
            yMin: isPercentageMode ? 0 : departmentPlan,
            yMax: isPercentageMode ? 0 : departmentPlan,
            borderColor: chartTheme.axisLabelColor,
            borderWidth: isPercentageMode ? 0 : 2,
            borderDash: [5, 5],
            label: {
              content: `План: ${departmentPlan.toLocaleString('ru-RU')} ₽`,
              enabled: !isPercentageMode,
              position: 'end' as const,
              backgroundColor: chartTheme.tooltipBackground,
              color: chartTheme.axisLabelColor,
              font: {
                size: 11,
                weight: 'bold' as const,
              },
              padding: 4,
            },
          },
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
        max: isPercentageMode ? 120 : calculateStackedYAxisMax(stackedDataForMax), // Максимальное значение с правильным округлением
        title: {
          display: true,
          text: isPercentageMode ? 'Доля (%)' : 'Выручка (₽)',
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
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            if (isPercentageMode) {
              return `${value}%`;
            } else {
              return value.toLocaleString('ru-RU');
            }
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
    <>
      <Card>
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, position: 'relative' }}
          >
            <Typography variant="h6">Выполнение плана отдела</Typography>
            <ExpandChartButton onClick={() => setIsFullScreen(true)} title="Раскрыть график" inline />
          </Box>

          <Box sx={{ height: getCardHeight(), position: 'relative' }}>
            <Bar ref={chartRef} data={chartData} options={options} />
          </Box>
        </CardContent>
      </Card>

      <FullScreenChartModal open={isFullScreen} onClose={() => setIsFullScreen(false)} title="Выполнение плана отдела">
        <Bar ref={chartRef} data={chartData} options={options} />
      </FullScreenChartModal>
    </>
  );
});
