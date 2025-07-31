import { memo, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { People, TrendingUp, Analytics, Assessment } from '@mui/icons-material';
import { MonthlyReportResponse } from '../../model/types/monthlyReport';
import { MoneyReportResponse } from '../../model/types/moneyReport';
import { AdditionalUserData } from '../../model/types/teamWebsocket';
import { MetricsCard } from '../MetricsCard';
import { StackedBarChartCard } from '../StackedBarChartCard';
import { ConversionBarChartCard } from '../ConversionBarChartCard';
import { MoneyReportCard } from '../MoneyReportCard';
import { CurrentMonthFilter } from '../CurrentMonthFilter';
import { ChartModeToggle } from '../ChartModeToggle';
import { useCurrentMonthFilter } from '../../lib/hooks/useCurrentMonthFilter';
import { useChartDisplayMode } from '../../lib/hooks/useChartDisplayMode';
import {
  processChannelData,
  processConversionData,
  processConversionDataByMonth,
  processConversionDataForBarChart,
  processConversionDataForGroupedBarChart,
  processSuccessByChannelData,
  processSuccessByChannelDataByMonth,
  processSuccessByChannelDataByMonthPercentage,
  processSuccessByTypeData,
  processSuccessByTypeDataByMonth,
  processSuccessByTypeDataByMonthPercentage,
  processFailedDealsData,
  processFailedDealsDataByMonth,
  processChannelDataByMonth,
  processManagerData,
} from '../../lib/monthlyReportHelpers';

interface BentoDashboardProps {
  data: MonthlyReportResponse;
  moneyData?: MoneyReportResponse;
  moneyIsLoading?: boolean;
  moneyError?: string;
  isLoading?: boolean;
  error?: string;
  additionalTeamData?: AdditionalUserData[];
}

export const BentoDashboard = memo((props: BentoDashboardProps) => {
  const { data, moneyData, moneyIsLoading, moneyError, isLoading, error, additionalTeamData = [] } = props;

  // Используем хук для фильтрации текущего месяца
  const { showCurrentMonth, setShowCurrentMonth, filteredData } = useCurrentMonthFilter(data);

  // Используем хук для управления режимами отображения графиков
  const { successByChannelMode, setSuccessByChannelMode, successByTypeMode, setSuccessByTypeMode } =
    useChartDisplayMode();

  const processedData = useMemo(() => {
    if (!filteredData) return null;

    return {
      channelData: processChannelData(filteredData),
      channelDataByMonth: processChannelDataByMonth(filteredData),
      conversionData: processConversionData(filteredData),
      conversionDataByMonth: processConversionDataByMonth(filteredData),
      conversionDataForBarChart: processConversionDataForBarChart(filteredData),
      conversionDataForGroupedBarChart: processConversionDataForGroupedBarChart(filteredData),
      successByChannelData: processSuccessByChannelData(filteredData),
      successByChannelDataByMonth: processSuccessByChannelDataByMonth(filteredData),
      successByChannelDataByMonthPercentage: processSuccessByChannelDataByMonthPercentage(filteredData),
      successByTypeData: processSuccessByTypeData(filteredData),
      successByTypeDataByMonth: processSuccessByTypeDataByMonth(filteredData),
      successByTypeDataByMonthPercentage: processSuccessByTypeDataByMonthPercentage(filteredData),
      failedDealsData: processFailedDealsData(filteredData),
      failedDealsDataByMonth: processFailedDealsDataByMonth(filteredData),
      managerData: processManagerData(filteredData),
    };
  }, [filteredData]);

  // Вычисляем общие метрики
  const totalMetrics = useMemo(() => {
    if (!filteredData) return null;

    let totalLeads = 0;
    let totalSuccess = 0;
    let totalQualified = 0;

    filteredData.result.users.forEach((user) => {
      user.reports.forEach((report) => {
        totalLeads += report.leadsTotal;
        totalSuccess += report.leadsSuccess;
        totalQualified += report.leadsQualified;
      });
    });

    const overallConversionRate = totalLeads > 0 ? (totalQualified / totalLeads) * 100 : 0;
    const overallSuccessRate = totalLeads > 0 ? (totalSuccess / totalLeads) * 100 : 0;

    return {
      totalLeads,
      totalSuccess,
      totalQualified,
      overallConversionRate,
      overallSuccessRate,
    };
  }, [filteredData]);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Загрузка дашборда...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" color="error" sx={{ mb: 3 }}>
          Ошибка загрузки данных: {error}
        </Typography>
      </Box>
    );
  }

  if (!processedData || !totalMetrics) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Нет данных для отображения
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Финансовые показатели менеджеров */}
      {moneyData && (
        <Box sx={{ mb: 4 }}>
          <MoneyReportCard
            data={moneyData}
            monthlyData={data}
            isLoading={moneyIsLoading}
            error={moneyError}
            additionalTeamData={additionalTeamData}
          />
        </Box>
      )}

      {/* Фильтр текущего месяца */}
      <CurrentMonthFilter showCurrentMonth={showCurrentMonth} onToggle={setShowCurrentMonth} />

      {/* Основные метрики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Общее количество лидов"
            value={totalMetrics.totalLeads.toLocaleString()}
            subtitle="За весь период"
            color="#1976d2"
            icon={<People />}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Успешные сделки"
            value={totalMetrics.totalSuccess.toLocaleString()}
            subtitle="Конверсия"
            color="#4caf50"
            icon={<TrendingUp />}
            size="medium"
            trend={{
              value: Math.round(totalMetrics.overallSuccessRate),
              isPositive: totalMetrics.overallSuccessRate > 50,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Квалифицированные лиды"
            value={totalMetrics.totalQualified.toLocaleString()}
            subtitle="От общего числа"
            color="#ff9800"
            icon={<Analytics />}
            size="medium"
            trend={{
              value: Math.round(totalMetrics.overallConversionRate),
              isPositive: totalMetrics.overallConversionRate > 70,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Активных менеджеров"
            value={filteredData?.result.users.length || 0}
            subtitle="В команде"
            color="#9c27b0"
            icon={<Assessment />}
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Графики */}
      <Grid container spacing={3}>
        {/* Количество лидов по менеджерам */}
        <Grid item xs={12}>
          <StackedBarChartCard
            title="Количество полученных лидов по менеджерам"
            data={processedData.managerData}
            yAxisLabel="Количество лидов"
            size="large"
          />
        </Grid>

        {/* Лиды по каналам */}
        <Grid item xs={12}>
          <StackedBarChartCard
            title="Лиды по каналам"
            data={processedData.channelDataByMonth}
            yAxisLabel="Количество лидов"
            size="medium"
          />
        </Grid>

        {/* Причины неуспешных сделок */}
        <Grid item xs={12}>
          <StackedBarChartCard
            title="Причины неуспешных сделок"
            data={processedData.failedDealsDataByMonth}
            yAxisLabel="Количество"
            size="medium"
          />
        </Grid>

        {/* Конверсия по месяцам */}
        <Grid item xs={12}>
          <ConversionBarChartCard
            title="Конверсия по месяцам"
            data={processedData.conversionDataForGroupedBarChart.chartData}
            monthLabels={processedData.conversionDataForGroupedBarChart.monthLabels}
            yAxisLabel="Количество лидов"
            size="large"
          />
        </Grid>

        {/* Успешные сделки по каналам */}
        <Grid item xs={12} md={6}>
          <Box>
            <ChartModeToggle
              mode={successByChannelMode}
              onModeChange={setSuccessByChannelMode}
              title="Режим отображения"
            />
            <StackedBarChartCard
              title="Успешные сделки по каналам"
              data={
                successByChannelMode === 'percentage'
                  ? processedData.successByChannelDataByMonthPercentage
                  : processedData.successByChannelDataByMonth
              }
              yAxisLabel={
                successByChannelMode === 'percentage' ? 'Процент от общего числа' : 'Количество успешных сделок'
              }
              size="medium"
              isPercentageMode={successByChannelMode === 'percentage'}
            />
          </Box>
        </Grid>

        {/* Успешные по типу */}
        <Grid item xs={12} md={6}>
          <Box>
            <ChartModeToggle mode={successByTypeMode} onModeChange={setSuccessByTypeMode} title="Режим отображения" />
            <StackedBarChartCard
              title="Успешные по типу"
              data={
                successByTypeMode === 'percentage'
                  ? processedData.successByTypeDataByMonthPercentage
                  : processedData.successByTypeDataByMonth
              }
              yAxisLabel={successByTypeMode === 'percentage' ? 'Процент от общего числа' : 'Количество успешных сделок'}
              size="medium"
              isPercentageMode={successByTypeMode === 'percentage'}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});
