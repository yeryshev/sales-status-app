import { useTheme } from '@mui/material/styles';
import { Theme } from '@/shared/const/theme';

export const useChartTheme = () => {
  const theme = useTheme();

  const isDark = theme.palette.mode === Theme.DARK;

  return {
    // Цвета для сетки осей
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',

    // Цвета для подписей осей
    axisLabelColor: isDark ? '#fff' : '#333',

    // Цвета для тултипов
    tooltipBackground: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
    tooltipTextColor: '#fff',
    tooltipBorderColor: isDark ? '#666' : '#1976d2',

    // Цвета для подписей данных (datalabels)
    dataLabelColor: isDark ? '#fff' : '#333',

    // Цвета для фона графиков
    chartBackground: isDark ? 'transparent' : 'transparent',

    // Цвета для границ точек
    pointBorderColor: isDark ? '#333' : '#fff',

    // Цвета для легенды
    legendTextColor: isDark ? '#fff' : '#333',

    // Цвета для заголовков
    titleColor: isDark ? '#fff' : '#333',
  };
};
