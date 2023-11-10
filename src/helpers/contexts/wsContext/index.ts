import { createContext, useContext } from 'react';

export interface SocketCtxState {
  socket: WebSocket;
}

export const SocketCtx = createContext<SocketCtxState>({} as SocketCtxState);

export const useSocketCtx = () => useContext(SocketCtx);
