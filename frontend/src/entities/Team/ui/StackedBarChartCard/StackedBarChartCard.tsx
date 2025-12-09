import { memo, useRef, useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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
  showNextMonth?: boolean;
}

export const StackedBarChartCard = memo((props: StackedBarChartCardProps) => {
  const {
    title,
    data,
    yAxisLabel = 'Количество',
    size = 'medium',
    isPercentageMode = false,
    showNextMonth = false,
  } = props;
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const chartTheme = useChartTheme();

  // Определяем текущий месяц
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    return `${year}-${month.toString().padStart(2, '0')}`;
  }, []);

  // Проверяем, есть ли данные для текущего месяца
  const hasCurrentMonthData = useMemo(() => {
    if (!data || data.length === 0) return false;
    const lastItem = data[data.length - 1];
    // Парсим метку месяца (формат: "Январь 2024")
    const monthNames = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    const parts = lastItem.label.split(' ');
    if (parts.length !== 2) return false;
    const monthName = parts[0];
    const year = parseInt(parts[1]);
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) return false;
    const monthKey = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
    return monthKey === currentMonthKey;
  }, [data, currentMonthKey]);

  // Определяем максимальное количество видимых столбцов
  const maxVisibleColumns = useMemo(() => {
    if (showNextMonth && hasCurrentMonthData) {
      return 16;
    }
    return 15;
  }, [showNextMonth, hasCurrentMonthData]);

  // Ограничиваем данные до последних N месяцев
  const limitedData = useMemo(() => {
    if (data.length <= maxVisibleColumns) {
      return data;
    }
    // Берем последние N месяцев
    return data.slice(-maxVisibleColumns);
  }, [data, maxVisibleColumns]);

  // Вычисляем, сколько всего данных и нужно ли показывать прокрутку
  const totalDataLength = data.length;
  const needsScroll = totalDataLength > maxVisibleColumns;
  const maxScrollIndex = Math.max(0, totalDataLength - maxVisibleColumns);

  // По умолчанию показываем последние N месяцев (scrollIndex = 0)
  // При прокрутке влево scrollIndex увеличивается (показываем более старые месяцы)
  // При прокрутке вправо scrollIndex уменьшается (показываем более новые месяцы)
  const canScrollLeft = scrollIndex < maxScrollIndex;
  const canScrollRight = scrollIndex > 0;

  // Данные для отображения с учетом прокрутки
  const displayData = useMemo(() => {
    if (!needsScroll) {
      return limitedData;
    }
    // Показываем данные с учетом текущей позиции прокрутки
    // scrollIndex = 0: последние N месяцев
    // scrollIndex = 1: предпоследние N месяцев
    // и т.д.
    const startIndex = totalDataLength - maxVisibleColumns - scrollIndex;
    const endIndex = startIndex + maxVisibleColumns;
    return data.slice(startIndex, endIndex);
  }, [data, maxVisibleColumns, scrollIndex, needsScroll, totalDataLength, limitedData]);

  const handleScrollLeft = useCallback(() => {
    setScrollIndex((prev) => Math.min(maxScrollIndex, prev + 1));
  }, [maxScrollIndex]);

  const handleScrollRight = useCallback(() => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Сбрасываем прокрутку при изменении данных или showNextMonth
  useEffect(() => {
    setScrollIndex(0);
  }, [data, showNextMonth]);

  const chartData = {
    labels: displayData.map((item) => item.label),
    datasets:
      displayData[0]?.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: displayData.map((item) => item.datasets[index]?.data || 0),
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
          label: function (context: { parsed: { y: number | null }; dataset: { label?: string } }) {
            const value = context.parsed.y;
            if (value === null) return '';
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
        max: isPercentageMode ? 120 : calculateStackedYAxisMax(displayData), // В процентном режиме максимум 120%
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
            {needsScroll && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: 8,
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50%',
                  boxShadow: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <IconButton
                  onClick={handleScrollLeft}
                  disabled={!canScrollLeft}
                  size="small"
                  sx={{
                    '&:disabled': {
                      opacity: 0.3,
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
              </Box>
            )}
            <Box
              sx={{
                overflowX: needsScroll ? 'hidden' : 'visible',
                width: '100%',
                height: '100%',
              }}
            >
              <Bar ref={chartRef} data={chartData} options={options} />
            </Box>
            {needsScroll && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50%',
                  boxShadow: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <IconButton
                  onClick={handleScrollRight}
                  disabled={!canScrollRight}
                  size="small"
                  sx={{
                    '&:disabled': {
                      opacity: 0.3,
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <FullScreenChartModal open={isFullScreen} onClose={() => setIsFullScreen(false)} title={title}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </FullScreenChartModal>
    </Fragment>
  );
});
