import { SocketCtx, SocketCtxState } from '@/app/providers/WsProvider/lib/WsContext';
import { type ReactNode } from 'react';

const url = `${import.meta.env.VITE_SOCKET_URL}`;
const mangoUrl = `${import.meta.env.VITE_MANGO_SOCKET_URL}`;
const tasksUrl = `${import.meta.env.VITE_TASKS_SOCKET_URL}`;

const SocketCtxProvider = (props: { children?: ReactNode }) => {
    const socket = new WebSocket(url);
    const mangoSocket = new WebSocket(mangoUrl);
    const tasksSocket = new WebSocket(tasksUrl);

    const websockets: SocketCtxState = [socket, mangoSocket, tasksSocket];

    return (
        <SocketCtx.Provider value={websockets}>
            {props.children}
        </SocketCtx.Provider>
    );
};

export default SocketCtxProvider;
