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
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 1, sm: 2 },
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          minWidth: { xs: 'auto', sm: 'fit-content' },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        {title}:
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          width: { xs: '100%', sm: 'auto' },
          '& .MuiToggleButton-root': {
            flex: { xs: 1, sm: 'none' },
          },
        }}
      >
        <ToggleButton value="absolute">Абсолютные</ToggleButton>
        <ToggleButton value="percentage">Проценты</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
});
