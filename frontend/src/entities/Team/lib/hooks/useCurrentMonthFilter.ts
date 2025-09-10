import { useState, useMemo } from 'react';
import { MonthlyReportResponse } from '../../model/types/monthlyReport';
import { formatMonthLabel } from '../monthlyReportHelpers';

// Функция для получения метки месяца из строки
const getMonthLabel = (monthString: string | null): string | null => {
  if (!monthString) return null;
  const parts = monthString.split('-');
  if (parts.length !== 2) return null;
  const [year, month] = parts;
  return formatMonthLabel(parseInt(year), parseInt(month));
};

export const useCurrentMonthFilter = (data: MonthlyReportResponse | null) => {
  const [showNextMonth, setShowNextMonth] = useState(false);

  // Определяем последний месяц из данных
  const lastMonth = useMemo((): string | null => {
    if (!data) return null;

    let latestMonth: string | null = null;
    let latestYear = 0;
    let latestMonthNumber = 0;

    data.result.users.forEach((user) => {
      user.reports.forEach((report) => {
        if (report.year > latestYear || (report.year === latestYear && report.month > latestMonthNumber)) {
          latestYear = report.year;
          latestMonthNumber = report.month;
          latestMonth = `${report.year}-${report.month.toString().padStart(2, '0')}`;
        }
      });
    });

    return latestMonth;
  }, [data]);

  // Определяем следующий месяц после последнего
  const nextMonth = useMemo(() => {
    if (!lastMonth || typeof lastMonth !== 'string') return null;

    const parts = lastMonth.split('-');
    if (parts.length !== 2) return null;

    const [year, month] = parts;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum)) return null;

    let nextYear = yearNum;
    let nextMonthNum = monthNum + 1;

    if (nextMonthNum > 12) {
      nextMonthNum = 1;
      nextYear = yearNum + 1;
    }

    return `${nextYear}-${nextMonthNum.toString().padStart(2, '0')}`;
  }, [lastMonth]);

  // Получаем отформатированную метку последнего месяца
  const lastMonthLabel = useMemo(() => {
    return getMonthLabel(lastMonth);
  }, [lastMonth]);

  // Получаем отформатированную метку следующего месяца
  const nextMonthLabel = useMemo(() => {
    return getMonthLabel(nextMonth);
  }, [nextMonth]);

  // Фильтруем данные: по умолчанию показываем все месяцы до следующего, при включении чекбокса - включаем следующий месяц
  const filteredData = useMemo(() => {
    if (!data || !nextMonth) {
      return data;
    }

    // Если showNextMonth = false, исключаем следующий месяц (показываем только до последнего включительно)
    if (!showNextMonth) {
      const filteredResponse: MonthlyReportResponse = {
        ...data,
        result: {
          ...data.result,
          users: data.result.users.map((user) => ({
            ...user,
            reports: user.reports.filter((report) => {
              const reportKey = `${report.year}-${report.month.toString().padStart(2, '0')}`;
              return reportKey !== nextMonth;
            }),
          })),
        },
      };
      return filteredResponse;
    }

    // Если showNextMonth = true, возвращаем все данные (включая следующий месяц)
    return data;
  }, [data, nextMonth, showNextMonth]);

  return {
    showNextMonth,
    setShowNextMonth,
    lastMonth,
    lastMonthLabel,
    nextMonth,
    nextMonthLabel,
    filteredData,
  };
};
