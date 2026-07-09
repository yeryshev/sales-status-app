import { memo } from 'react';
import { Grid, Paper, Typography, Box, alpha } from '@mui/material';
import { AccessTime, Groups, WorkOutline, WifiOff } from '@mui/icons-material';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusAnalyticsSummary } from '@/entities/StatusAnalytics';
import { formatDurationFromHours } from '@/entities/StatusAnalytics';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor: string;
}

const SummaryCard = memo(({ title, value, subtitle, icon, accentColor }: SummaryCardProps) => (
  <Paper sx={{ p: 2.5, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(accentColor, theme.palette.mode === 'light' ? 0.12 : 0.2),
          color: accentColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
));

export const StatusAnalyticsSummaryCards = memo(() => {
  const summary = useAppSelector(getStatusAnalyticsSummary);

  if (!summary) return null;

  const avgSuffix = summary.isAveraged ? ' / раб. день' : '';
  const workingDaysHint = summary.isAveraged
    ? `среднее за ${summary.workingDaysCount} раб. дней`
    : `${summary.segmentCount} периодов`;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title={summary.isAveraged ? 'Всего учтено (среднее)' : 'Всего учтено'}
          value={formatDurationFromHours(summary.totalDurationHours)}
          subtitle={workingDaysHint}
          icon={<AccessTime />}
          accentColor="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title={`Работа и встречи${avgSuffix}`}
          value={formatDurationFromHours(summary.workDurationHours)}
          subtitle={summary.isAveraged ? workingDaysHint : `${summary.workPercentage}% от общего`}
          icon={<WorkOutline />}
          accentColor="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title={`Оффлайн${avgSuffix}`}
          value={formatDurationFromHours(summary.offlineDurationHours)}
          subtitle={summary.isAveraged ? 'без выходных и отпусков' : `${summary.uniqueStatuses} статусов`}
          icon={<WifiOff />}
          accentColor="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Сотрудников"
          value={String(summary.uniqueUsers)}
          subtitle="в выборке"
          icon={<Groups />}
          accentColor="#0288d1"
        />
      </Grid>
    </Grid>
  );
});
