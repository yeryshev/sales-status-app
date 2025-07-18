import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useGetMonthlyReportQuery } from '@/entities/Team';
import { BentoDashboard } from '@/entities/Team';

interface MonthlyReportContainerProps {
  active: boolean;
}

export const MonthlyReportContainer = memo((props: MonthlyReportContainerProps) => {
  const { active } = props;

  // Проверяем, установлена ли переменная окружения
  const hasApiUrl = !!import.meta.env.VITE_MONTHLY_REPORT_URL;

  const {
    data: monthlyReportData,
    isLoading,
    error,
  } = useGetMonthlyReportQuery(undefined, {
    skip: !active || !hasApiUrl,
  });

  if (!active) {
    return null;
  }

  // Если переменная окружения не установлена
  if (!hasApiUrl) {
    return (
      <Box sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Для отображения отчета необходимо установить переменную окружения VITE_MONTHLY_REPORT_URL
          </Typography>
        </Box>
      </Box>
    );
  }

  // Определяем сообщение об ошибке
  let errorMessage: string | undefined;
  if (error) {
    if ('status' in error && error.status === 404) {
      errorMessage = 'API не найден. Проверьте правильность URL в VITE_MONTHLY_REPORT_URL';
    } else if ('status' in error && typeof error.status === 'number' && error.status >= 500) {
      errorMessage = 'Ошибка сервера. Попробуйте позже';
    } else {
      errorMessage = 'Ошибка загрузки данных. Проверьте подключение к интернету';
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <BentoDashboard data={monthlyReportData!} isLoading={isLoading} error={errorMessage} />
    </Box>
  );
});
