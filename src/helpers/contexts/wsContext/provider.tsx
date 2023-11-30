import { ReactNode } from 'react';
import { SocketCtx } from './index';

const url = `${import.meta.env.VITE_SOCKET_URL}`;

const SocketCtxProvider = (props: { children?: ReactNode }) => {
  const socket = new WebSocket(url);
  return <SocketCtx.Provider value={{ socket }}>{props.children}</SocketCtx.Provider>;
};

export default SocketCtxProvider;
