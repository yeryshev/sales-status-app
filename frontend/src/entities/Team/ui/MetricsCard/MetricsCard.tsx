import { memo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const MetricsCard = memo((props: MetricsCardProps) => {
  const { title, value, subtitle, trend, color = '#1976d2', icon, size = 'medium' } = props;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { height: 120, p: 2 };
      case 'large':
        return { height: 200, p: 3 };
      default:
        return { height: 160, p: 2.5 };
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        ...getSizeStyles(),
        borderRadius: 2,
        border: `1px solid ${color}20`,
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {icon && <Box sx={{ color: color, opacity: 0.7 }}>{icon}</Box>}
          </Box>

          <Typography
            variant={size === 'large' ? 'h4' : size === 'small' ? 'h6' : 'h5'}
            sx={{
              fontWeight: 700,
              color: color,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.isPositive ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: '1rem', mr: 0.5 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
});
