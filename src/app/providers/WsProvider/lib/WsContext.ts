import { createContext, useContext } from 'react';

export type SocketCtxState = [socket?: WebSocket, mangoSocket?: WebSocket, tasksSocket?: WebSocket];

export const SocketCtx = createContext<SocketCtxState>([]);

export const useSocketCtx = () => useContext(SocketCtx);
