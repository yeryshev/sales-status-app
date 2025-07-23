import { memo } from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Fullscreen } from '@mui/icons-material';

interface ExpandChartButtonProps {
  onClick: () => void;
  title?: string;
  position?: 'top-left' | 'top-right';
  inline?: boolean;
}

export const ExpandChartButton = memo((props: ExpandChartButtonProps) => {
  const { onClick, title = 'Раскрыть график', position = 'top-right', inline = false } = props;
  const theme = useTheme();

  const getPositionStyles = () => {
    if (inline) {
      return {};
    }

    switch (position) {
      case 'top-left':
        return {
          top: 8,
          left: 8,
        };
      case 'top-right':
      default:
        return {
          top: 8,
          right: 8,
        };
    }
  };

  return (
    <Tooltip title={title} placement="top">
      <IconButton
        onClick={onClick}
        size="small"
        sx={{
          position: inline ? 'static' : 'absolute',
          ...getPositionStyles(),
          zIndex: 10,
          bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.hover : 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <Fullscreen sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
});
