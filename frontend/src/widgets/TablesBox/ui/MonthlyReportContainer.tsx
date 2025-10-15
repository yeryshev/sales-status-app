import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useGetMonthlyReportQuery, useGetMoneyReportQuery, AdditionalUserData } from '@/entities/Team';
import { BentoDashboard } from '@/entities/Team';

interface MonthlyReportContainerProps {
  active: boolean;
  additionalTeamData?: AdditionalUserData[];
  isAccountManagersRoute?: boolean;
}

export const MonthlyReportContainer = memo((props: MonthlyReportContainerProps) => {
  const { active, additionalTeamData = [], isAccountManagersRoute = false } = props;

  // Проверяем, установлены ли переменные окружения
  const hasMonthlyApiUrl = !!import.meta.env.VITE_MONTHLY_REPORT_URL;
  const hasMoneyApiUrl = !!import.meta.env.VITE_MONEY_REPORT_URL;

  const {
    data: monthlyReportData,
    isLoading: monthlyIsLoading,
    error: monthlyError,
  } = useGetMonthlyReportQuery(isAccountManagersRoute, {
    skip: !active || !hasMonthlyApiUrl,
  });

  const {
    data: moneyReportData,
    isLoading: moneyIsLoading,
    error: moneyError,
  } = useGetMoneyReportQuery(isAccountManagersRoute, {
    skip: !active || !hasMoneyApiUrl,
  });

  if (!active) {
    return null;
  }

  // Если переменная окружения для месячного отчета не установлена
  if (!hasMonthlyApiUrl) {
    return (
      <Box>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Для отображения отчета необходимо установить переменную окружения VITE_MONTHLY_REPORT_URL
          </Typography>
        </Box>
      </Box>
    );
  }

  // Определяем сообщение об ошибке для месячного отчета
  let monthlyErrorMessage: string | undefined;
  if (monthlyError) {
    if ('status' in monthlyError && monthlyError.status === 404) {
      monthlyErrorMessage = 'API не найден. Проверьте правильность URL в VITE_MONTHLY_REPORT_URL';
    } else if ('status' in monthlyError && typeof monthlyError.status === 'number' && monthlyError.status >= 500) {
      monthlyErrorMessage = 'Ошибка сервера. Попробуйте позже';
    } else {
      monthlyErrorMessage = 'Ошибка загрузки данных. Проверьте подключение к интернету';
    }
  }

  // Определяем сообщение об ошибке для финансового отчета
  let moneyErrorMessage: string | undefined;
  if (moneyError) {
    if ('status' in moneyError && moneyError.status === 404) {
      moneyErrorMessage = 'API не найден. Проверьте правильность URL в VITE_MONEY_REPORT_URL';
    } else if ('status' in moneyError && typeof moneyError.status === 'number' && moneyError.status >= 500) {
      moneyErrorMessage = 'Ошибка сервера. Попробуйте позже';
    } else {
      moneyErrorMessage = 'Ошибка загрузки данных. Проверьте подключение к интернету';
    }
  }

  return (
    <Box>
      <BentoDashboard
        data={monthlyReportData!}
        isLoading={monthlyIsLoading}
        error={monthlyErrorMessage}
        moneyData={moneyReportData}
        moneyIsLoading={moneyIsLoading}
        moneyError={moneyErrorMessage}
        additionalTeamData={additionalTeamData}
        isAccountManagersRoute={isAccountManagersRoute}
      />
    </Box>
  );
});
