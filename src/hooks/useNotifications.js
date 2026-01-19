"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useNotifications(onEvent, token) {
  const socketRef = useRef(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!token) return;
    if (socketRef.current) return;

    const socket = io({
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 socket connected");
    });

    socket.on("event", (event) => {
      onEventRef.current?.(event);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ socket error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return socketRef;
}
