import { memo, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { People, TrendingUp, Analytics, Assessment } from '@mui/icons-material';
import { MonthlyReportResponse } from '../../model/types/monthlyReport';
import { MetricsCard } from '../MetricsCard';
import { PieChartCard } from '../PieChartCard';
import { LineChartCard } from '../LineChartCard';
import { BarChartCard } from '../BarChartCard';
import { StackedBarChartCard } from '../StackedBarChartCard';
import {
  processChannelData,
  processConversionData,
  processSuccessByChannelData,
  processSuccessByTypeData,
  processFailedDealsData,
  processFailedDealsDataByMonth,
  processChannelDataByMonth,
  processManagerData,
} from '../../lib/monthlyReportHelpers';

interface BentoDashboardProps {
  data: MonthlyReportResponse;
  isLoading?: boolean;
  error?: string;
}

export const BentoDashboard = memo((props: BentoDashboardProps) => {
  const { data, isLoading, error } = props;

  const processedData = useMemo(() => {
    if (!data) return null;

    return {
      channelData: processChannelData(data),
      channelDataByMonth: processChannelDataByMonth(data),
      conversionData: processConversionData(data),
      successByChannelData: processSuccessByChannelData(data),
      successByTypeData: processSuccessByTypeData(data),
      failedDealsData: processFailedDealsData(data),
      failedDealsDataByMonth: processFailedDealsDataByMonth(data),
      managerData: processManagerData(data),
    };
  }, [data]);

  // Вычисляем общие метрики
  const totalMetrics = useMemo(() => {
    if (!data) return null;

    let totalLeads = 0;
    let totalSuccess = 0;
    let totalQualified = 0;

    data.result.users.forEach((user) => {
      user.reports.forEach((report) => {
        totalLeads += report.leads_total;
        totalSuccess += report.leads_success;
        totalQualified += report.leads_qualified;
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
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Загрузка дашборда...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error" sx={{ mb: 3 }}>
          Ошибка загрузки данных: {error}
        </Typography>
      </Box>
    );
  }

  if (!processedData || !totalMetrics) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Нет данных для отображения
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
        Аналитика продаж
      </Typography>

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
            value={data.result.users.length}
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
          <LineChartCard
            title="Конверсия по месяцам"
            data={processedData.conversionData.map((item) => ({
              label: item.period,
              value: Math.round(item.conversionRate),
            }))}
            color="#4caf50"
            yAxisLabel="Конверсия (%)"
            size="medium"
          />
        </Grid>

        {/* Успешность по каналам */}
        <Grid item xs={12} md={6}>
          <BarChartCard
            title="Успешность по каналам"
            data={processedData.successByChannelData.map((item) => ({
              label: item.channel,
              value: Math.round(item.successRate),
              color: item.color,
            }))}
            yAxisLabel="Успешность (%)"
            horizontal={true}
            size="medium"
          />
        </Grid>

        {/* Успешные по типу */}
        <Grid item xs={12} md={6}>
          <PieChartCard
            title="Успешные по типу"
            data={processedData.successByTypeData.map((item) => ({
              label: item.type,
              value: item.value,
              color: item.color,
            }))}
            size="medium"
          />
        </Grid>
      </Grid>
    </Box>
  );
});
