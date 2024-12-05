import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { TestProps } from '@/shared/types/tests';

interface PageProps extends TestProps {
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
      data-testid={props['data-testid'] ?? 'page-wrapper'}
    >
      <Toolbar />
      {children}
    </Box>
  );
};
