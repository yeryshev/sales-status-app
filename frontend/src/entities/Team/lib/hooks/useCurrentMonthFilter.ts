import { useState, useMemo } from 'react';
import { MonthlyReportResponse } from '../../model/types/monthlyReport';

// удалено: форматирование метки месяца больше не используется здесь

export const useCurrentMonthFilter = (data: MonthlyReportResponse | null) => {
  const [showNextMonth, setShowNextMonth] = useState(false);

  // Определяем текущий календарный месяц (YYYY-MM)
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    return `${year}-${month.toString().padStart(2, '0')}`;
  }, []);

  // Получаем отформатированную метку последнего месяца
  const lastMonthLabel = useMemo(() => {
    return null;
  }, []);

  // Получаем отформатированную метку следующего месяца
  const nextMonthLabel = useMemo(() => {
    return null;
  }, []);

  // Фильтруем данные: по умолчанию исключаем текущий месяц, при включении чекбокса — включаем текущий месяц
  const filteredData = useMemo(() => {
    if (!data) {
      return data;
    }

    // Если showNextMonth = false, исключаем текущий календарный месяц
    if (!showNextMonth) {
      const filteredResponse: MonthlyReportResponse = {
        ...data,
        result: {
          ...data.result,
          users: data.result.users.map((user) => ({
            ...user,
            reports: user.reports.filter((report) => {
              const reportKey = `${report.year}-${report.month.toString().padStart(2, '0')}`;
              return reportKey !== currentMonthKey;
            }),
          })),
        },
      };
      return filteredResponse;
    }

    // Если showNextMonth = true, возвращаем все данные (включая текущий месяц)
    return data;
  }, [data, currentMonthKey, showNextMonth]);

  return {
    showNextMonth,
    setShowNextMonth,
    lastMonth: null,
    lastMonthLabel,
    nextMonth: null,
    nextMonthLabel,
    filteredData,
  };
};
