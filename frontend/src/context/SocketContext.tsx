import { io, type Socket } from "socket.io-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SocketContextValue = {
  socket: Socket | null;
  joinPoll: (pollId: string) => void;
  leavePoll: (pollId: string) => void;
  onResponseNew: (
    cb: (payload: { pollId: string; totalSubmissions: number }) => void,
  ) => () => void;
  onPollEnded: (cb: (payload: { pollId: string }) => void) => () => void;
  onPollPublished: (cb: (payload: { pollId: string }) => void) => () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const base = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;
    const s = io(base, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(s);
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  const joinPoll = useCallback(
    (pollId: string) => {
      socket?.emit("poll:join", pollId);
    },
    [socket],
  );

  const leavePoll = useCallback(
    (pollId: string) => {
      socket?.emit("poll:leave", pollId);
    },
    [socket],
  );

  const onResponseNew = useCallback(
    (cb: (payload: { pollId: string; totalSubmissions: number }) => void) => {
      if (!socket) return () => {};
      socket.on("response:new", cb);
      return () => {
        socket.off("response:new", cb);
      };
    },
    [socket],
  );

  const onPollEnded = useCallback(
    (cb: (payload: { pollId: string }) => void) => {
      if (!socket) return () => {};
      socket.on("poll:ended", cb);
      return () => {
        socket.off("poll:ended", cb);
      };
    },
    [socket],
  );

  const onPollPublished = useCallback(
    (cb: (payload: { pollId: string }) => void) => {
      if (!socket) return () => {};
      socket.on("poll:published", cb);
      return () => {
        socket.off("poll:published", cb);
      };
    },
    [socket],
  );

  const value = useMemo<SocketContextValue>(
    () => ({
      socket,
      joinPoll,
      leavePoll,
      onResponseNew,
      onPollEnded,
      onPollPublished,
    }),
    [socket, joinPoll, leavePoll, onResponseNew, onPollEnded, onPollPublished],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return ctx;
}
