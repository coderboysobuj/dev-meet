import { Container, Divider, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useCallback, useContext, useState, useEffect, useMemo } from "react";
import { Socket } from "socket.io-client";
import { serverInstance } from "../api";
import Login from "../components/Auth/Login";
import Dashboard from "../components/Dashboard";
import Lobby from "../components/Lobby";
import CallingModal from "../components/Modal/CallingModal";
import Navbar from "../components/Navbar";
import { IFirebaseContext, useFirebase } from "../context/FirebaseContext";
import {
  MediaStreamContext,
  TMediaSteamContext,
} from "../context/MediaSteamContext";
import {
  ScreenStreamContext,
  TScreenStreemContext,
} from "../context/ScreenStreamContext";
import { SocketContext } from "../context/SocketContext";
import Peer from "../services/Peer";
import { IncommingCall, User } from "../types";

const Home: NextPage = () => {
  const { currentUser } = useFirebase() as IFirebaseContext;
  const socket = useContext(SocketContext) as Socket;

  const [users, setUsers] = useState<User[]>([]);
  const [calledToUserId, setCalledToUserId] = useState<string | undefined>();
  const [incomminCallData, setIncommingCallData] = useState<
    IncommingCall | undefined
  >();

  const { remoteStreams, setUserMediaStream, setRemoteMediaStreams } =
    useContext(MediaStreamContext) as TMediaSteamContext;

  const {
    setUserMediaScreenStream,
    setScreenRemoteMediaStream,
    userScreenStream,
  } = useContext(ScreenStreamContext) as TScreenStreemContext;

  const [remoteUser, setRemoteUser] = useState<User | undefined | null>();
  const [remoteSocketID, setRemoteSocketID] = useState<string | undefined>();
  const isCallModalOpen = useMemo(
    () => Boolean(incomminCallData !== undefined),
    [incomminCallData]
  );

  const loadUsers = useCallback(async () => {
    const { data } = await serverInstance.get("/users");

    setUsers(data.users);
  }, []);

  const joinRoom = useCallback(async () => {
    try {
      if (currentUser && currentUser.displayName && currentUser.email) {
        socket.emit("room:join", {
          username: `${currentUser.displayName} - ${currentUser.email}`,
          displayPicture: currentUser.photoURL,
          platform: "macos",
        });
      }
    } catch (error) {
      joinRoom();
    }
  }, [currentUser]);

  const handleClickUser = useCallback(async (user: User) => {
    const offer = await Peer.getOffer();

    if (offer) {
      console.log("clicked");
      socket.emit("peer:call", { to: user.socketID, offer });
      setCalledToUserId(user.socketID);
    }
  }, []);

  const handleIncommingCall = useCallback((data: IncommingCall) => {
    if (data) {
      setIncommingCallData(data);
    }
  }, []);
  const handleAcceptIncommingCall = useCallback(async () => {
    if (!incomminCallData) return;
    const { from, user, offer } = incomminCallData;
    if (offer) {
      const answer = await Peer.getAnswer(offer);
      if (answer) {
        socket.emit("peer:call-accepted", { to: from, offer: answer });
        setRemoteUser({
          displayPicture: user.displayPicture,
          username: user.username,
          isConnected: user.isConnected,
          joinedAt: user.joinedAt,
          platform: "macos",
          socketID: from,
        });
      }
      setRemoteSocketID(from);
    }
  }, [incomminCallData]);

  const handleRejectIncomingCall = useCallback(() => {
    setIncommingCallData(undefined);
  }, []);

  const handleCallAccepted = useCallback(async (data: IncommingCall) => {
    const { from, user, offer } = data;
    await Peer.setRemoteDesc(offer);
    setRemoteUser({
      displayPicture: user.displayPicture,
      username: user.username,
      isConnected: user.isConnected,
      joinedAt: user.joinedAt,
      platform: "macos",
      socketID: user.socketID,
    });
    setRemoteSocketID(from);
  }, []);

  useEffect(() => {
    if (remoteSocketID) setIncommingCallData(undefined);
  }, [remoteSocketID]);

  useEffect(() => {
    Peer.remoteSocketID = remoteSocketID;
  }, [remoteSocketID]);

  const handleNegotiation = useCallback(
    async (event: Event) => {
      const offer = await Peer.getOffer();
      socket.emit("peer:negotiate", {
        to: Peer.remoteSocketID,
        offer,
      });
    },
    [remoteSocketID]
  );

  const handleRequiredPeerNigotiate = useCallback(async (data: any) => {
    const { from, offer } = data;
    if (offer) {
      const answer = await Peer.getAnswer(offer);
      socket.emit("peer:nigotiate-result", {
        to: from,
        offer: answer,
      });
    }
  }, []);

  const handleRequiredPeerNegotiateFinalResult = useCallback(
    async (data: any) => {
      const { from, offer } = data;
      if (offer) {
        await Peer.setRemoteDesc(offer);
      }
    },
    []
  );

  const handleStartAudioVideoStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    if (stream && setUserMediaStream) setUserMediaStream(stream);

    for (const track of stream.getTracks()) {
      if (Peer.peer) {
        Peer.peer?.addTrack(track, stream);
      }
    }
  }, []);

  const handleStartScreenShareStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({});
    if (stream && setUserMediaScreenStream) setUserMediaScreenStream(stream);

    const track = stream.getTracks()[0];
    if (Peer.peer) {
      Peer.peer?.addTrack(track, stream);
    }
  }, []);

  const handleStopScreenShareStream = useCallback(() => {
    if (userScreenStream) {
      const tracks = userScreenStream.getTracks();
      tracks.forEach((track) => track.stop());
      if (setUserMediaScreenStream) {
        setUserMediaScreenStream(null);
      }
    }
  }, [userScreenStream, setUserMediaScreenStream]);

  // useEffect

  useEffect(() => {
    joinRoom();
  }, [currentUser]);

  useEffect(() => {
    loadUsers();

    const peerServer = Peer.init();
    peerServer?.peer?.addEventListener("negotiationneeded", handleNegotiation);
    if (peerServer?.peer) {
      peerServer.peer.addEventListener("track", async (ev: any) => {
        const remoteStream = ev.streams;
        if (remoteStream && setRemoteMediaStreams) {
          setRemoteMediaStreams([...remoteStreams, remoteStream[0]]);
        }
      });
    }
  }, [remoteStreams]);

  useEffect(() => {
    if (remoteSocketID) {
      socket.off("refresh:user-list", loadUsers);
    }

    return () => {
      socket.on("refresh:user-list", loadUsers);
    };
  }, [remoteSocketID]);

  useEffect(() => {
    socket.on("refresh:user-list", loadUsers);
    socket.on("peer:incomming-call", handleIncommingCall);
    socket.on("peer:call-accepted", handleCallAccepted);
    socket.on("peer:negotiate", handleRequiredPeerNigotiate);
    socket.on("peer:negotiate-result", handleRequiredPeerNegotiateFinalResult);

    return () => {
      socket.off("refresh:user-list", loadUsers);
      socket.off("peer:incomming-call", handleIncommingCall);
      socket.off("peer:call-accepted", handleCallAccepted);
      socket.off("peer:negotiate", handleRequiredPeerNigotiate);
      socket.off(
        "peer:negotiate-result",
        handleRequiredPeerNegotiateFinalResult
      );
    };
  }, []);

  return (
    <>
      <Head>
        <title>Develoer meeting applicaton - by Jisan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!currentUser ? (
        <Login />
      ) : (
        <Stack height="100vh">
          <Container maxW="container.lg" p={4} height="full">
            <Stack spacing={5}>
              <Navbar />
              <Divider />
              {remoteSocketID ? (
                <Dashboard
                  startAudioVideoStreams={handleStartAudioVideoStream}
                  remoteSocketID={remoteSocketID}
                  startScreenShareStreams={handleStartScreenShareStream}
                  stopScreenShareStreams={handleStopScreenShareStream}
                />
              ) : (
                <>
                  <Lobby users={users} handleClick={handleClickUser} />
                  <CallingModal
                    onReject={handleRejectIncomingCall}
                    onAccept={handleAcceptIncommingCall}
                    username={incomminCallData?.user.username}
                    isOpen={isCallModalOpen}
                    onClose={() => {}}
                  />
                </>
              )}
            </Stack>
          </Container>
        </Stack>
      )}
    </>
  );
};

export default Home;
