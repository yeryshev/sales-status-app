import { memo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen } from '@mui/icons-material';

interface ExpandChartButtonProps {
  onClick: () => void;
  title?: string;
}

export const ExpandChartButton = memo((props: ExpandChartButtonProps) => {
  const { onClick, title = 'Раскрыть график' } = props;

  return (
    <Tooltip title={title} placement="top">
      <IconButton
        onClick={onClick}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 1)',
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
