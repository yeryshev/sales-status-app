import { useEffect } from 'react';

export const handleVisibilityChange = (socket: WebSocket) => {
  if (!document.hidden) {
    if (socket.readyState !== WebSocket.OPEN) {
      window.location.reload();
    }
  }
};

export const useVisibilityChange = (statusCommentsSocket: WebSocket) => {
  useEffect(() => {
    const handleVisibility = () => handleVisibilityChange(statusCommentsSocket);

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [statusCommentsSocket]);
};
