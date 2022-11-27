import { createContext, PropsWithChildren, useState } from "react";

export type TScreenStreemContext = {
  remoteScreenStream: MediaStream | null;
  userScreenStream: MediaStream | null;
  setUserMediaScreenStream?: (stream: MediaStream | null) => void;
  setScreenRemoteMediaStream?: (stream: MediaStream) => void;
};

export const ScreenStreamContext = createContext<TScreenStreemContext | null>(
  null
);

export type TScreenStreamProviderProps = {} & PropsWithChildren;
export const ScreenStreamProvider: React.FunctionComponent<
  TScreenStreamProviderProps
> = ({ children }) => {
  const [screenRemoteMediaStream, setScreenRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const [userMediaScreenStream, setUserMediaScreenStream] =
    useState<MediaStream | null>(null);

  return (
    <ScreenStreamContext.Provider
      value={{
        remoteScreenStream: screenRemoteMediaStream,
        userScreenStream: userMediaScreenStream,
        setScreenRemoteMediaStream,
        setUserMediaScreenStream,
      }}
    >
      {children}
    </ScreenStreamContext.Provider>
  );
};
