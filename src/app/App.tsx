import { useEffect } from 'react';
import { AppRouter } from './providers/router';
import { useSocketCtx } from './providers/WsProvider';

/**
 * Handles the visibility change event of the document.
 * If the document is no longer hidden and both the `socket` and `mangoSocket` are not open,
 * it reloads the window.
 *
 * @param socket - передаёт информацию о смене статусов и комментариев
 * @param mangoSocket - передаёт информацию о телефоонных разговорах из Mango Office
 */
const handleVisibilityChange = (socket: WebSocket, mangoSocket: WebSocket) => {
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

const App = () => {
  const { socket, mangoSocket } = useSocketCtx();

  useEffect(() => {
    document.addEventListener('visibilitychange', () =>
      handleVisibilityChange(socket, mangoSocket)
    );

    return () => {
      document.removeEventListener('visibilitychange', () =>
        handleVisibilityChange(socket, mangoSocket)
      );
    };
  }, [socket, mangoSocket]);

  return <AppRouter />;
};

export default App;
