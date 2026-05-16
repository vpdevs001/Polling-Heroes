import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN ?? true,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("poll:join", (pollId: unknown) => {
      if (typeof pollId === "string" && pollId.length > 0) {
        socket.join(`poll:${pollId}`);
      }
    });
    socket.on("poll:leave", (pollId: unknown) => {
      if (typeof pollId === "string" && pollId.length > 0) {
        socket.leave(`poll:${pollId}`);
      }
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

export function emitResponseNew(pollId: string, totalSubmissions: number) {
  getIO()
    .to(`poll:${pollId}`)
    .emit("response:new", { pollId, totalSubmissions });
}

export function emitPollEnded(pollId: string) {
  getIO().to(`poll:${pollId}`).emit("poll:ended", { pollId });
}

export function emitPollPublished(pollId: string) {
  getIO().to(`poll:${pollId}`).emit("poll:published", { pollId });
}
