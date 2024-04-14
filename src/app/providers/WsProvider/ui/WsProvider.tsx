import { SocketCtx, SocketCtxState } from '@/app/providers/WsProvider/lib/WsContext';
import { type ReactNode } from 'react';

const url = `${import.meta.env.VITE_SOCKET_URL}`;

interface WsProviderProps {
  children: ReactNode;
}

const SocketCtxProvider = (props: WsProviderProps) => {
  const { children } = props;
  const socket = new WebSocket(url);

  const websockets: SocketCtxState = [socket];

  return <SocketCtx.Provider value={websockets}>{children}</SocketCtx.Provider>;
};

export default SocketCtxProvider;
