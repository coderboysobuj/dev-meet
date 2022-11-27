import { createContext, PropsWithChildren, useState } from "react";

export type TMediaSteamContext = {
  remoteStreams: MediaStream[];
  userStream: MediaStream | null;
  setUserMediaStream?: (stream: MediaStream) => void;
  setRemoteMediaStreams?: (stream: MediaStream[]) => void;
};

export const MediaStreamContext = createContext<TMediaSteamContext | null>(
  null
);

type TMediaSteamProviderProps = {} & PropsWithChildren;
export const MediaStreamProvider: React.FunctionComponent<
  TMediaSteamProviderProps
> = ({ children }) => {
  const [remoteMediaStreams, setRemoteMediaStreams] = useState<MediaStream[]>(
    []
  );

  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(
    null
  );

  return (
    <MediaStreamContext.Provider
      value={{
        remoteStreams: remoteMediaStreams,
        userStream: userMediaStream,
        setRemoteMediaStreams,
        setUserMediaStream,
      }}
    >
      {children}
    </MediaStreamContext.Provider>
  );
};
