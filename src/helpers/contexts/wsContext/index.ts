import { createContext, useContext } from 'react';
// import { Socket } from 'socket.io-client';

export interface SocketCtxState {
  socket: WebSocket;
}

export const SocketCtx = createContext<SocketCtxState>({} as SocketCtxState);

export const useSocketCtx = () => useContext(SocketCtx);
