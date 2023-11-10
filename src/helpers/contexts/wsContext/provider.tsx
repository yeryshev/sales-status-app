import { ReactNode, useRef } from 'react';
import { SocketCtx } from './index';

const SocketCtxProvider = (props: { children?: ReactNode }) => {
  // const socketRef = useRef(new WebSocket(`${import.meta.env.VITE_SOCKET_URL}`));
  const socketRef = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}`);

  return <SocketCtx.Provider value={{ socket: socketRef }}>{props.children}</SocketCtx.Provider>;
};

export default SocketCtxProvider;
