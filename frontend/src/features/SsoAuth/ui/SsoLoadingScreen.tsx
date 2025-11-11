import { Box, CircularProgress } from '@mui/material';
import { memo } from 'react';

export const SsoLoadingScreen = memo(() => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
});
