import { memo, useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Tooltip,
} from '@mui/material';
import { MoneyReportResponse } from '../../model/types/moneyReport';
import { MonthlyReportResponse } from '../../model/types/monthlyReport';
import { AdditionalUserData } from '../../model/types/teamWebsocket';
import { processMoneyReportData, getLastMonth, formatCurrency, getNettColor } from '../../lib/moneyReportHelpers';
import { TextReportCard } from '../TextReportCard';

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

interface MoneyReportCardProps {
  data: MoneyReportResponse;
  monthlyData?: MonthlyReportResponse;
  isLoading?: boolean;
  error?: string;
  additionalTeamData?: AdditionalUserData[];
  isAccountManagersRoute?: boolean;
}

export const MoneyReportCard = memo((props: MoneyReportCardProps) => {
  const { data, monthlyData, isLoading, error, additionalTeamData = [] } = props;
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Обрабатываем данные
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return null;
    return processMoneyReportData(data);
  }, [data]);

  // Устанавливаем последний месяц по умолчанию
  useEffect(() => {
    if (processedData && !selectedMonth) {
      const defaultMonth = getLastMonth(processedData.months);
      if (defaultMonth) {
        setSelectedMonth(defaultMonth);
      }
    }
  }, [processedData, selectedMonth]);

  // Получаем данные для выбранного месяца
  const monthData = useMemo(() => {
    if (!processedData || !selectedMonth) return null;

    const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);

    const monthManagers = processedData.managers.map((manager) => {
      const managerData = processedData.data[manager][selectedMonth];

      // Получаем количество новых клиентов из monthlyData
      let newClients = 0;
      if (monthlyData) {
        const moneyDataEntry = data.find((item) => item.managerName === manager);
        if (moneyDataEntry) {
          const monthlyUser = monthlyData.result.users.find((user) => user.idInside === moneyDataEntry.idInside);
          if (monthlyUser) {
            const monthlyReport = monthlyUser.reports.find(
              (report) => report.year === selectedYear && report.month === selectedMonthNum,
            );
            if (monthlyReport) {
              newClients = monthlyReport.leads142Newsale;
            }
          }
        }
      }

      return {
        name: manager,
        faktK: managerData?.faktK || 0,
        plan: managerData?.plan || 0,
        nett: managerData?.nett || 0,
        newClients,
      };
    });

    return monthManagers.sort((a, b) => b.nett - a.nett); // Сортируем по nett
  }, [processedData, selectedMonth, monthlyData, data]);

  // Функция для получения аватарки по idInside
  const getAvatarByManagerName = (managerName: string): string => {
    // Находим запись в финансовых данных по имени менеджера
    const moneyDataEntry = data.find((item) => item.managerName === managerName);
    if (!moneyDataEntry) return '';

    // Ищем аватарку в additionalTeamData по idInside
    const userData = additionalTeamData.find((user) => user.idInside === moneyDataEntry.idInside);
    return userData?.avatar || '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <Typography color="text.secondary">Загрузка...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!monthData || monthData.length === 0) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <Typography color="text.secondary" variant="body2">
            Нет данных для отображения
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Финансовые показатели менеджеров
        </Typography>

        {/* Селектор месяца */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel id="month-selector-label" htmlFor="month-selector-input">
            Месяц
          </FormLabel>
          <Select
            id="month-selector"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            inputProps={{
              'aria-labelledby': 'month-selector-label',
              id: 'month-selector-input',
              name: 'month-selector',
            }}
          >
            {processedData?.months.map((month) => {
              const [year, monthNum] = month.split('-');
              const monthLabel = `${monthNames[parseInt(monthNum) - 1]} ${year}`;
              return (
                <MenuItem key={month} value={month}>
                  {monthLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Сетка менеджеров */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {monthData.map((manager) => {
            const avatarUrl = getAvatarByManagerName(manager.name);
            const initials = manager.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <Card key={manager.name} variant="outlined">
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: { xs: 2, sm: 3 },
                  }}
                >
                  {/* Аватар */}
                  <Avatar
                    alt={manager.name}
                    src={avatarUrl}
                    sx={{
                      width: { xs: 80, sm: 105 },
                      height: { xs: 80, sm: 105 },
                      mb: { xs: 1, sm: 2 },
                      bgcolor: avatarUrl ? 'transparent' : 'primary.main',
                      fontSize: { xs: '1.6rem', sm: '2.1rem' },
                      fontWeight: 600,
                    }}
                  >
                    {!avatarUrl && initials}
                  </Avatar>

                  {/* Имя */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      textAlign: 'center',
                      mb: { xs: 1, sm: 2 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {manager.name}
                  </Typography>

                  {/* Nett */}
                  <Tooltip title="С учетом черна" arrow placement="top">
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: getNettColor(manager.nett),
                        mb: { xs: 0.5, sm: 1 },
                        textAlign: 'center',
                        cursor: 'help',
                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                      }}
                    >
                      {formatCurrency(manager.nett)}
                    </Typography>
                  </Tooltip>

                  {/* FaktK */}
                  <Tooltip title="Фактический рост" arrow placement="bottom">
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        cursor: 'help',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        mb: { xs: 0.5, sm: 1 },
                      }}
                    >
                      {formatCurrency(manager.faktK)}
                    </Typography>
                  </Tooltip>

                  {/* Новые клиенты */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      fontWeight: 500,
                    }}
                  >
                    Новых клиентов: {manager.newClients}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Текстовый отчет */}
        {selectedMonth && (
          <Box sx={{ mt: 4 }}>
            <TextReportCard
              year={parseInt(selectedMonth.split('-')[0])}
              month={parseInt(selectedMonth.split('-')[1])}
              department={props.isAccountManagersRoute ? 'account' : 'inbound'}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
});
