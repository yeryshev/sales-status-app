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
        return { minHeight: 120, padding: 2 };
      case 'large':
        return { minHeight: 200, padding: 3 };
      default:
        return { minHeight: 160, padding: 2.5 };
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        ...getSizeStyles(),
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
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
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.isPositive ? (
              <TrendingUp sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: '#f44336', fontSize: '1rem', mr: 0.5 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? '#4caf50' : '#f44336',
                fontWeight: 600,
                fontSize: '0.75rem',
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
