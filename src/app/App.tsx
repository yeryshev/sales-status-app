import { useEffect } from 'react';
import { AppRouter } from './providers/router';
import { useSocketCtx } from './providers/WsProvider';

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
        document.addEventListener('visibilitychange', () => {
            handleVisibilityChange(socket, mangoSocket);
        });

        return () => {
            document.removeEventListener('visibilitychange', () => {
                handleVisibilityChange(socket, mangoSocket);
            });
        };
    }, [socket, mangoSocket]);

    return <AppRouter />;
};

export default App;
