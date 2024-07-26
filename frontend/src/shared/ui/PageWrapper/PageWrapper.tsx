import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

interface PageProps {
  children: ReactNode;
}

export const PageWrapper = (props: PageProps) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      {children}
    </Box>
  );
};
