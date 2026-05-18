"use client";

import { useSocket } from "@/contexts/SocketContext";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

export default function SocketStatusBanner({ onRetry }) {
  const { status, error, connected } = useSocket();

  if (connected) return null;

  if (status === "connecting" || status === "reconnecting") {
    return (
      <Alert variant="info" className="mb-4 flex items-center gap-3">
        <Spinner className="!py-0" label="" />
        <span className="text-sm">
          {status === "reconnecting"
            ? "Reconnecting to live updates…"
            : "Connecting to live updates…"}
        </span>
      </Alert>
    );
  }

  if (status === "error" || status === "disconnected") {
    return (
      <Alert variant="warning" className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm">
          {error || "Live updates are offline. The feed may be out of date."}
        </span>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Refresh feed
          </Button>
        )}
      </Alert>
    );
  }

  return null;
}
