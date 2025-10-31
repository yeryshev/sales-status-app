import { PeriodType } from '../model/types/statusAnalytics';

/**
 * Получает текущую дату в московском времени (UTC+3)
 */
const getMoscowDate = (): Date => {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
};

/**
 * Форматирует дату в строку YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Получает первый день недели (понедельник)
 */
const getWeekStart = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Если воскресенье (0), то -6, иначе 1 - день недели
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday;
};

/**
 * Получает последний день недели (воскресенье)
 */
const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const sunday = new Date(weekStart);
  sunday.setDate(weekStart.getDate() + 6);
  return sunday;
};

/**
 * Получает первый день месяца
 */
const getMonthStart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Получает последний день месяца
 */
const getMonthEnd = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Рассчитывает даты начала и конца периода на основе типа периода
 */
export const calculatePeriodDates = (periodType: PeriodType): { startDate: string; endDate: string } => {
  const today = getMoscowDate();

  switch (periodType) {
    case 'today': {
      const dateStr = formatDate(today);
      return { startDate: dateStr, endDate: dateStr };
    }

    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const dateStr = formatDate(yesterday);
      return { startDate: dateStr, endDate: dateStr };
    }

    case 'last30days': {
      const start = new Date(today);
      start.setDate(today.getDate() - 29); // 29 дней назад + сегодня = 30 дней
      return {
        startDate: formatDate(start),
        endDate: formatDate(today),
      };
    }

    case 'currentWeek': {
      const weekStart = getWeekStart(today);
      const weekEnd = getWeekEnd(today);
      return {
        startDate: formatDate(weekStart),
        endDate: formatDate(weekEnd),
      };
    }

    case 'lastWeek': {
      const lastWeekDate = new Date(today);
      lastWeekDate.setDate(today.getDate() - 7);
      const weekStart = getWeekStart(lastWeekDate);
      const weekEnd = getWeekEnd(lastWeekDate);
      return {
        startDate: formatDate(weekStart),
        endDate: formatDate(weekEnd),
      };
    }

    case 'currentMonth': {
      const currentMonthStart = getMonthStart(today);
      const currentMonthEnd = getMonthEnd(today);
      return {
        startDate: formatDate(currentMonthStart),
        endDate: formatDate(currentMonthEnd),
      };
    }

    case 'lastMonth': {
      const lastMonthDate = new Date(today);
      // Устанавливаем день в 1, чтобы избежать проблем с переполнением месяца
      // (например, 31 октября - 1 месяц = 31 сентября -> 1 октября)
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(today.getMonth() - 1);
      const monthStart = getMonthStart(lastMonthDate);
      const monthEnd = getMonthEnd(lastMonthDate);
      return {
        startDate: formatDate(monthStart),
        endDate: formatDate(monthEnd),
      };
    }

    case 'custom':
    default: {
      // Для custom возвращаем текущую дату, но пользователь может изменить вручную
      const dateStr = formatDate(today);
      return { startDate: dateStr, endDate: dateStr };
    }
  }
};

/**
 * Определяет, является ли период однодневным (для таймлайна)
 */
export const isSingleDayPeriod = (periodType: PeriodType, startDate?: string, endDate?: string): boolean => {
  // Для предопределенных периодов
  if (periodType === 'today' || periodType === 'yesterday') {
    return true;
  }

  // Для кастомного периода проверяем, что startDate и endDate одинаковые
  if (periodType === 'custom' && startDate && endDate) {
    return startDate === endDate;
  }

  return false;
};

/**
 * Получает текстовое название периода
 */
export const getPeriodLabel = (periodType: PeriodType): string => {
  const labels: Record<PeriodType, string> = {
    today: 'Сегодня',
    yesterday: 'Вчера',
    last30days: 'Последние 30 дней',
    currentWeek: 'Текущая неделя',
    lastWeek: 'Прошлая неделя',
    currentMonth: 'Текущий месяц',
    lastMonth: 'Прошлый месяц',
    custom: 'Произвольный период',
  };
  return labels[periodType];
};
