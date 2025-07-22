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
  const [showCurrentMonth, setShowCurrentMonth] = useState(false);

  // Определяем текущий месяц из данных
  const currentMonth = useMemo(() => {
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

  // Получаем отформатированную метку текущего месяца
  const currentMonthLabel = useMemo(() => {
    return getMonthLabel(currentMonth);
  }, [currentMonth]);

  // Фильтруем данные, исключая текущий месяц если чекбокс отключен
  const filteredData = useMemo(() => {
    if (!data || !currentMonth || showCurrentMonth) {
      return data;
    }

    // Создаем копию данных без текущего месяца
    const filteredResponse: MonthlyReportResponse = {
      ...data,
      result: {
        ...data.result,
        users: data.result.users.map((user) => ({
          ...user,
          reports: user.reports.filter((report) => {
            const reportKey = `${report.year}-${report.month.toString().padStart(2, '0')}`;
            return reportKey !== currentMonth;
          }),
        })),
      },
    };

    return filteredResponse;
  }, [data, currentMonth, showCurrentMonth]);

  return {
    showCurrentMonth,
    setShowCurrentMonth,
    currentMonth,
    currentMonthLabel,
    filteredData,
  };
};
