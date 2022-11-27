import express, { Application } from "express";

import cors from "cors";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { v4 as uuid } from "uuid";

const PORT: number = Number(process.env.PORT) || 8000;

const app: Application = express();

const server: http.Server = http.createServer(app);

const io = new SocketServer({ cors: { origin: "*" } });
io.attach(server);

interface IUser {
  socketID: string;
  username: string;
  displayPicture: string;
  platform: string;
  joinedAt: Date;
  isConnected: boolean;
}

interface IRoomUser {
  id: string;
  fullName: string;
  email: string;
}

app.use(cors());
app.use(express.json());

// State

const users: Map<string, IUser> = new Map<string, IUser>();
const roomUsers: Map<string, IRoomUser> = new Map();

io.on("connection", (socket) => {
  console.log(`New socket connection ID: ${socket.id}`);

  socket.on("room:join", (data) => {
    const { username, displayPicture, platform } = data;
    users.set(socket.id, {
      socketID: socket.id,
      username,
      displayPicture,
      platform,
      joinedAt: new Date(),
      isConnected: false,
    });

    io.emit("refresh:user-list");
  });

  socket.on("peer:call", (data) => {
    const { to, offer } = data;
    socket.to(to).emit("peer:incomming-call", {
      from: socket.id,
      user: users.get(socket.id),
      offer,
    });
  });

  socket.on("peer:call-accepted", (data) => {
    const { to, offer } = data;

    // if (users.has(to)) {
    //   //@ts-ignore
    //   users.get(to)?.isConnected = true;
    // }
    // if (users.has(socket.id)) {
    //   //@ts-ignore
    //   users.get(socket.id)?.isConnected = true;
    // }
    socket.to(to).emit("peer:call-accepted", {
      from: socket.id,
      user: users.get(socket.id),
      offer,
    });

    const whtieBoardID = uuid();
    io.to([to, socket.id]).emit("whiteboard:id", { whtieBoardID });

    io.emit("refresh:user-list");
  });

  socket.on("peer:nigotiate", (data) => {
    const { to, offer } = data;
    socket.to(to).emit("peer:nigotiate", { from: socket.id, offer });
  });

  socket.on("peer:nigotiate-result", (data) => {
    const { to, offer } = data;
    socket.to(to).emit("peer:nigotiate-result", { from: socket.id, offer });
  });

  socket.on("whiteboard:drawing", (data) => {
    const { to } = data;
    socket.to(to).emit("whiteboard:data", { from: socket.id, data: data });
  });

  socket.on("chat:message", (data) => {
    const { to, message } = data;
    socket.emit("chat:message", {
      from: socket.id,
      message,
      self: true,
      user: users.get(socket.id),
    });

    socket.to(to).emit("chat:message", {
      from: socket.id,
      message,
      user: users.get(socket.id),
    });
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("user-disconnected", { socketID: socket.id });
    io.emit("refresh:user-list");
  });
});

app.get("/users", (req, res) => {
  const filteredUser: any[] = Array.from(users.values())
    .map((user) => ({
      ...user,
    }))
    .filter((u) => !u.isConnected);
  return res.json({ users: filteredUser });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
