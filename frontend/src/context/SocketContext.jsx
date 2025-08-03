import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

    console.log("Attempting to connect to socket server at:", serverUrl);

    if (!serverUrl || serverUrl === "undefined") {
      console.error(
        "Socket server URL is not defined. Check your environment variables."
      );
      setConnectionError(true);
      return;
    }

    const newSocket = io(serverUrl, {
      reconnectionAttempts: 5, // Retry connection 5 times
      timeout: 10000, // 10 seconds timeout
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setConnectionError(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      setConnectionError(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.io.on("reconnect_attempt", (attempt) => {
      console.warn(`Reconnect attempt #${attempt}`);
    });

    newSocket.io.on("reconnect_failed", () => {
      console.error("Failed to reconnect to socket server");
      setConnectionError(true);
    });

    return () => {
      console.log("Disconnecting from socket server");
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (eventName, data) => {
    if (socket) {
      console.log(`Sending message to event "${eventName}":`, data);
      socket.emit(eventName, data);
    }
  };

  const receiveMessage = (eventName, callback) => {
    if (socket) {
      console.log(`Listening for messages on event "${eventName}"`);
      socket.on(eventName, callback);
    }
  };

  return (
    <SocketContext.Provider
      value={{ sendMessage, receiveMessage, connectionError }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
