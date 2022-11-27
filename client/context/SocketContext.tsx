import React, { createContext, PropsWithChildren, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

type TSocketProviderProps = {} & PropsWithChildren;

export const SocketProvider: React.FunctionComponent<TSocketProviderProps> = ({
  children,
}) => {
  const socket = useMemo(
    () => io(process.env.NEXT_PUBLIC_SERVER_API_URL as string),
    []
  );
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
