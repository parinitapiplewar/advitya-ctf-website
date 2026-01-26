"use client";

import { useState } from "react";
import { Play, ExternalLink, Loader2 } from "lucide-react";

export default function InstancePanel({ challengeId }) {
  const [loading, setLoading] = useState(false);
  const [instanceUrl, setInstanceUrl] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState(null);

  const startInstance = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/challenges/instance/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeId }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to start instance");
      }

      setInstanceUrl(data.url);
      setExpiresAt(data.expiresAt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white/5 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase">
          Challenge Instance
        </h3>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Start Button */}
      {!instanceUrl && (
        <button
          onClick={startInstance}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded bg-white/20 hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Get Instance URL
            </>
          )}
        </button>
      )}

      {/* Instance Active */}
      {instanceUrl && (
        <>
          <div className="text-sm text-white/70">
            Instance running
            {expiresAt && (
              <>
                {" "}
                • expires at{" "}
                <span className="text-white">
                  {new Date(expiresAt).toLocaleTimeString()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={instanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/90 text-black text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Open Instance
            </a>
          </div>

          {/* Embedded view (for web challenges) */}
          {/* <div className="border border-white/10 rounded overflow-hidden h-[400px]">
            <iframe
              src={instanceUrl}
              title="Challenge Instance"
              className="w-full h-full bg-black"
            />
          </div> */}
        </>
      )}
    </div>
  );
}
