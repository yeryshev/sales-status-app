import { ReactNode } from 'react';
import { SocketCtx } from './index';

const url = `${import.meta.env.VITE_SOCKET_URL}`;
const mangoUrl = `${import.meta.env.VITE_MANGO_SOCKET_URL}`;

const SocketCtxProvider = (props: { children?: ReactNode }) => {
  const socket = new WebSocket(url);
  const mangoSocket = new WebSocket(mangoUrl);
  return <SocketCtx.Provider value={{ socket, mangoSocket }}>{props.children}</SocketCtx.Provider>;
};

export default SocketCtxProvider;
