import { useEffect } from 'react';

export const useVisibilityChange = (statusCommentsSocket: WebSocket) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (statusCommentsSocket.readyState !== WebSocket.OPEN) {
          window.location.reload();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [statusCommentsSocket]);
};
