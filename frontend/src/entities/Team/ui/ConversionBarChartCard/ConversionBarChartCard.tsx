import { memo, useMemo, useState, Fragment, useCallback, useEffect } from 'react';
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
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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
  showNextMonth?: boolean;
}

export const ConversionBarChartCard = memo((props: ConversionBarChartCardProps) => {
  const {
    title,
    data,
    monthLabels,
    isLoading,
    error,
    size = 'medium',
    yAxisLabel = 'Количество лидов',
    showNextMonth = false,
  } = props;
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
    if (!monthLabels || monthLabels.length === 0) return false;
    const lastLabel = monthLabels[monthLabels.length - 1];
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
    const parts = lastLabel.split(' ');
    if (parts.length !== 2) return false;
    const monthName = parts[0];
    const year = parseInt(parts[1]);
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) return false;
    const monthKey = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
    return monthKey === currentMonthKey;
  }, [monthLabels, currentMonthKey]);

  // Определяем максимальное количество видимых столбцов
  const maxVisibleColumns = useMemo(() => {
    if (showNextMonth && hasCurrentMonthData) {
      return 16;
    }
    return 15;
  }, [showNextMonth, hasCurrentMonthData]);

  // Ограничиваем данные до последних N месяцев
  const totalMonths = monthLabels.length;
  const needsScroll = totalMonths > maxVisibleColumns;
  const maxScrollIndex = Math.max(0, totalMonths - maxVisibleColumns);

  const canScrollLeft = scrollIndex < maxScrollIndex;
  const canScrollRight = scrollIndex > 0;

  // Данные для отображения с учетом прокрутки
  const displayMonthLabels = useMemo(() => {
    if (!needsScroll) {
      return monthLabels.slice(-maxVisibleColumns);
    }
    const startIndex = totalMonths - maxVisibleColumns - scrollIndex;
    const endIndex = startIndex + maxVisibleColumns;
    return monthLabels.slice(startIndex, endIndex);
  }, [monthLabels, maxVisibleColumns, scrollIndex, needsScroll, totalMonths]);

  // Ограничиваем данные соответственно
  const displayData = useMemo(() => {
    if (!needsScroll) {
      // Берем последние N месяцев (каждый месяц = 3 элемента данных)
      const monthsToShow = maxVisibleColumns;
      const dataPointsPerMonth = 3;
      const startDataIndex = data.length - monthsToShow * dataPointsPerMonth;
      return data.slice(startDataIndex);
    }
    // При прокрутке берем соответствующие данные
    const monthsToShow = maxVisibleColumns;
    const dataPointsPerMonth = 3;
    const startMonthIndex = totalMonths - maxVisibleColumns - scrollIndex;
    const startDataIndex = startMonthIndex * dataPointsPerMonth;
    const endDataIndex = startDataIndex + monthsToShow * dataPointsPerMonth;
    return data.slice(startDataIndex, endDataIndex);
  }, [data, maxVisibleColumns, scrollIndex, needsScroll, totalMonths]);

  const handleScrollLeft = useCallback(() => {
    setScrollIndex((prev) => Math.min(maxScrollIndex, prev + 1));
  }, [maxScrollIndex]);

  const handleScrollRight = useCallback(() => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Сбрасываем прокрутку при изменении данных или showNextMonth
  useEffect(() => {
    setScrollIndex(0);
  }, [data, showNextMonth, monthLabels]);

  const chartData = useMemo(() => {
    if (!displayData.length) return null;

    // Группируем данные по типам (Получено лидов, Квалифицировано, Успешно реализовано)
    const receivedData = displayData.filter((_, index) => index % 3 === 0).map((item) => item.value);
    const qualifiedData = displayData.filter((_, index) => index % 3 === 1).map((item) => item.value);
    const successfulData = displayData.filter((_, index) => index % 3 === 2).map((item) => item.value);

    return {
      labels: displayMonthLabels,
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
  }, [displayData, displayMonthLabels]);

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
        max: calculateYAxisMax(displayData.map((item) => item.value)), // Максимальное значение с правильным округлением
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
              <Bar data={chartData} options={options} />
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
        </Box>
      </Paper>

      <FullScreenChartModal open={isFullScreen} onClose={() => setIsFullScreen(false)} title={title}>
        <Bar data={chartData} options={options} />
      </FullScreenChartModal>
    </Fragment>
  );
});
