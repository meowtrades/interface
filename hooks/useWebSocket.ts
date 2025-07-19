/** @format */

import { useEffect, useRef, useState, useCallback } from "react";

export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  shouldReconnect?: boolean;
}

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  lastMessage: WebSocketMessage | null;
  connectionStatus: "Connecting" | "Open" | "Closing" | "Closed";
  sendMessage: (message: unknown) => void;
  reconnect: () => void;
}

export const useWebSocket = (
  url: string | null,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    shouldReconnect = true,
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connecting" | "Open" | "Closing" | "Closed"
  >("Closed");

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!url) return;

    try {
      setConnectionStatus("Connecting");
      const ws = new WebSocket(url);
      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = () => {
        setConnectionStatus("Open");
        reconnectCountRef.current = 0;
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        setConnectionStatus("Closed");
        setSocket(null);
        socketRef.current = null;
        onClose?.();

        // Attempt to reconnect if enabled
        if (shouldReconnect && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionStatus("Closed");
    }
  }, [
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    shouldReconnect,
    reconnectAttempts,
    reconnectInterval,
  ]);
  const sendMessage = useCallback(
    (message: unknown) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open. Cannot send message:", message);
      }
    },
    [socket]
  );

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, connect]);

  return {
    socket,
    lastMessage,
    connectionStatus,
    sendMessage,
    reconnect,
  };
};
