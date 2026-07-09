import { Theme } from '@mui/material/styles';

/** Matches backend app_statuses["offline"] */
export const OFFLINE_STATUS_ID = 3;

const STATUS_CHIP_COLORS: Record<number, 'success' | 'warning' | 'default' | 'info' | 'secondary' | 'primary'> = {
  1: 'success',
  2: 'warning',
  3: 'default',
  5: 'info',
  6: 'info',
  7: 'success',
};

const FALLBACK_CHART_COLORS = ['#4caf50', '#ff9800', '#9e9e9e', '#2196f3', '#9c27b0', '#00bcd4', '#f44336', '#795548'];

export const getStatusChartColor = (statusId: number, index = 0, theme?: Theme): string => {
  if (theme) {
    switch (statusId) {
      case 1: // работаю
        return theme.palette.success.main;
      case 7: // встреча — тот же зелёный тон, чуть светлее
        return theme.palette.success.light;
      case 2: // занят
        return theme.palette.warning.main;
      case 5: // обед
        return theme.palette.info.main;
      case 6: // отошёл — тот же синий тон, чуть светлее
        return theme.palette.info.light;
      case 3: // оффлайн
        return theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[400];
      default:
        break;
    }
  }
  return FALLBACK_CHART_COLORS[index % FALLBACK_CHART_COLORS.length];
};

export const getStatusChipColor = (
  statusId: number,
): 'success' | 'warning' | 'default' | 'info' | 'secondary' | 'primary' => {
  return STATUS_CHIP_COLORS[statusId] || 'default';
};

export const getStatusChipColorByTitle = (statusTitle: string): 'success' | 'default' | 'info' => {
  const title = statusTitle.toLowerCase();
  if (title.includes('оффлайн') || title.includes('offline')) return 'default';
  if (title.includes('работа')) return 'success';
  return 'info';
};

export const isOfflineStatus = (statusId: number, statusTitle?: string): boolean => {
  if (statusId === OFFLINE_STATUS_ID) return true;
  if (!statusTitle) return false;
  const title = statusTitle.toLowerCase();
  return title.includes('оффлайн') || title.includes('offline');
};
