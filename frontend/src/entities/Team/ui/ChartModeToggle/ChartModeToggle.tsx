import { memo } from 'react';
import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import { DisplayMode } from '../../lib/hooks/useChartDisplayMode';

interface ChartModeToggleProps {
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  title: string;
}

export const ChartModeToggle = memo((props: ChartModeToggleProps) => {
  const { mode, onModeChange, title } = props;

  const handleChange = (_: React.MouseEvent<HTMLElement>, newMode: DisplayMode | null) => {
    if (newMode !== null) {
      onModeChange(newMode);
    }
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 'fit-content' }}>
        {title}:
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            px: 2,
            py: 0.5,
            fontSize: '0.75rem',
            textTransform: 'none',
          },
        }}
      >
        <ToggleButton value="absolute">Абсолютные</ToggleButton>
        <ToggleButton value="percentage">Проценты</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
});
