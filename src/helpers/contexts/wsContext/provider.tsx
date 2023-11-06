import { ReactNode, useRef } from 'react';
// import { io } from 'socket.io-client';
import { SocketCtx } from './index';

const SocketCtxProvider = (props: { children?: ReactNode }) => {
  const socketRef = useRef(new WebSocket(`ws://localhost:8000/ws/1`));

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current }}>{props.children}</SocketCtx.Provider>
  );
};

export default SocketCtxProvider;
