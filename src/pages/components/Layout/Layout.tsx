import { ReactNode, useEffect } from 'react';
import { useSocketCtx } from '@/app/providers/WsProvider/lib/WsContext.ts';
import { Navbar } from '@/widgets/Navbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

const Layout = ({ children }: { children: ReactNode }) => {
  const { socket, mangoSocket } = useSocketCtx();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (
          socket &&
          socket.readyState !== WebSocket.OPEN &&
          mangoSocket &&
          mangoSocket.readyState !== WebSocket.OPEN
        ) {
          window.location.reload();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket, mangoSocket]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      {children}
    </Box>
  );
};

export default Layout;
