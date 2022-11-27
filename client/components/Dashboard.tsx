import React, { useEffect, useRef } from "react";
import {
  MediaStreamContext,
  TMediaSteamContext,
} from "../context/MediaSteamContext";

interface DashboardProps {
  startAudioVideoStreams: () => void;
  startScreenShareStreams: () => void;
  stopScreenShareStreams: () => void;
  remoteSocketID: string;
}

const Dashboard: React.FunctionComponent<DashboardProps> = ({
  startAudioVideoStreams,
  startScreenShareStreams,
  stopScreenShareStreams,
  remoteSocketID,
}) => {
  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as TMediaSteamContext;
  useEffect(() => {
    startAudioVideoStreams();
  }, []);

  useEffect(() => {}, [userStream, remoteStreams]);

  return <div></div>;
};

export default Dashboard;
