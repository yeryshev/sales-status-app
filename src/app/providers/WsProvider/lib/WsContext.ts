import { createContext, useContext } from 'react';

export interface SocketCtxState {
  socket: WebSocket
  mangoSocket: WebSocket
}

export const SocketCtx = createContext<SocketCtxState>({} as SocketCtxState);

export const useSocketCtx = () => useContext(SocketCtx);
