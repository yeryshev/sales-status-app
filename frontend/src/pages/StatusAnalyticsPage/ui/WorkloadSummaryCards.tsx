import { memo } from 'react';
import { Grid, Paper, Typography, Box, alpha } from '@mui/material';
import {
  FeedbackOutlined,
  HourglassBottomOutlined,
  QuestionAnswerOutlined,
  RequestQuoteOutlined,
} from '@mui/icons-material';
import { useAppSelector } from '@/shared/lib/hooks';
import {
  getWorkloadAnalyticsSummary,
  WORKLOAD_METRICS,
  formatWorkloadValue,
  getWorkloadMetricValue,
} from '@/entities/StatusAnalytics';

const METRIC_ICONS = {
  leads: <RequestQuoteOutlined />,
  overdueTasks: <HourglassBottomOutlined />,
  openConversations: <QuestionAnswerOutlined />,
  assignedTickets: <FeedbackOutlined />,
} as const;

export const WorkloadSummaryCards = memo(() => {
  const summary = useAppSelector(getWorkloadAnalyticsSummary);

  if (!summary) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {WORKLOAD_METRICS.map((metric) => (
        <Grid item xs={12} sm={6} md={3} key={metric.key}>
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
                  bgcolor: (theme) => alpha(metric.color, theme.palette.mode === 'light' ? 0.12 : 0.2),
                  color: metric.color,
                  flexShrink: 0,
                }}
              >
                {METRIC_ICONS[metric.key]}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {formatWorkloadValue(getWorkloadMetricValue(summary.averages, metric.key))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  среднее за период · {summary.snapshotDays} дн.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
});
