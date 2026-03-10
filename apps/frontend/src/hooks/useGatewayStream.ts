"use client";

import { useEffect, useRef, useState } from "react";

import { fallbackSnapshot } from "@/data/fallback-snapshot";
import { parseStreamMessage, type DashboardSnapshot } from "@/lib/stream";

export type StreamState = "connecting" | "live" | "reconnecting" | "offline";

const DEFAULT_STREAM_URL =
  process.env.NEXT_PUBLIC_STREAM_WS_URL ?? "ws://localhost:8080/api/v1/ws/stream";

export function useGatewayStream(streamUrl = DEFAULT_STREAM_URL) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(fallbackSnapshot);
  const [state, setState] = useState<StreamState>("connecting");
  const [lastError, setLastError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const clearRetryTimeout = () => {
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };

    const connect = (isReconnect: boolean) => {
      if (!active) {
        return;
      }

      setState(isReconnect ? "reconnecting" : "connecting");

      try {
        const socket = new WebSocket(streamUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          if (!active) {
            return;
          }

          setState("live");
          setLastError(null);
        };

        socket.onmessage = (event) => {
          if (!active) {
            return;
          }

          const nextSnapshot = parseStreamMessage(event.data);

          if (nextSnapshot) {
            setSnapshot(nextSnapshot);
          }
        };

        socket.onerror = () => {
          if (!active) {
            return;
          }

          setLastError("Stream connection failed. Retrying automatically.");
        };

        socket.onclose = () => {
          if (!active) {
            return;
          }

          setState("offline");

          retryTimeoutRef.current = window.setTimeout(() => {
            connect(true);
          }, 2000);
        };
      } catch {
        setState("offline");
        setLastError("Invalid websocket endpoint configured.");

        retryTimeoutRef.current = window.setTimeout(() => {
          connect(true);
        }, 2000);
      }
    };

    connect(false);

    return () => {
      active = false;
      clearRetryTimeout();
      socketRef.current?.close();
    };
  }, [streamUrl]);

  return {
    snapshot,
    state,
    lastError,
    streamUrl,
  };
}
