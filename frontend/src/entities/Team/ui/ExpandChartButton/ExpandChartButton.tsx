import { memo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen } from '@mui/icons-material';

interface ExpandChartButtonProps {
  onClick: () => void;
  title?: string;
  position?: 'top-left' | 'top-right';
  inline?: boolean;
}

export const ExpandChartButton = memo((props: ExpandChartButtonProps) => {
  const { onClick, title = 'Раскрыть график', position = 'top-right', inline = false } = props;

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
        }}
      >
        <Fullscreen sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
});
