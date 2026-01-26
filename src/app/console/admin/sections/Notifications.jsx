"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminNotificationsPage() {
  const { token, user, role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [target, setTarget] = useState("global");
  const [targetId, setTargetId] = useState("");
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("info");

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      toast.error("Unauthorized", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth-error",
      });
      router.replace("/Auth/login");
      return;
    }

    if (role !== "sudo") {
      toast.error("Unauthorized", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth-error",
      });
      router.replace("/");
      return;
    }

    setAuthorized(true);
  }, [authLoading, user, token, role, router]);


  useEffect(() => {
    if (!authorized) return;

    const controller = new AbortController();

    setLoadingMeta(true);
    setError("");

    Promise.all([
      fetch("/api/admin/notify/meta/teams", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }).then((r) => r.json()),

      fetch("/api/admin/notify/meta/users", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }).then((r) => r.json()),
    ])
      .then(([teamsRes, usersRes]) => {
        if (!teamsRes.success || !usersRes.success) {
          throw new Error("Unauthorized");
        }

        setTeams(teamsRes.teams || []);
        setUsers(usersRes.users || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Failed to load teams/users");
          toast.error("Unauthorized", {
            theme: "dark",
            position: "bottom-right",
            autoClose: 3000,
            toastId: "auth-error",
          });
          router.replace("/");
        }
      })
      .finally(() => setLoadingMeta(false));

    return () => controller.abort();
  }, [authorized, token, router]);


  async function sendNotification() {
    if (!message.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target,
          targetId: target === "global" ? null : targetId,
          event: {
            type: "ADMIN_NOTIFICATION",
            message,
            level,
          },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setMessage("");
    } catch {
      setError("Failed to send notification");
    } finally {
      setSending(false);
    }
  }

  const isTargetInvalid =
    (target === "team" || target === "user") && !targetId;


  if (!authorized || loadingMeta) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">
            Loading Notifications...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">
            Broadcast Message / Announcement
          </h1>
        </div>
        <div className="gap-2 flex">
          <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl text-sm font-medium ">
            <span className="bg-red-400 rounded-full w-4 h-4"></span>
            <span>LIVE</span>
          </span>
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

      <div className="w-full max-w-xl p-8 mx-auto bg-white/5 mt-8 rounded-2xl border border-white/20">
        {/* TARGET */}
        <label className="block text-sm mb-2">Target</label>
        <select
          disabled={loadingMeta}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 mb-4 disabled:opacity-50"
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setTargetId("");
          }}
        >
          <option className="bg-black" value="global">
            Global
          </option>
          <option className="bg-black" value="team">
            Team
          </option>
          <option className="bg-black" value="user">
            User
          </option>
        </select>

        {target === "team" && (
          <select
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 mb-4"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            <option className="bg-black" value="" disabled>
              Select Team
            </option>
            {teams.map((t) => (
              <option className="bg-black" key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        {target === "user" && (
          <select
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 mb-4"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            <option className="bg-black" value="" disabled>
              Select User
            </option>
            {users.map((u) => (
              <option className="bg-black" key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        <label className="block text-sm mb-2">Message</label>
        <textarea
          className="w-full bg-white/10 border border-white/20 p-3 mb-4 resize-none rounded-lg"
          rows={4}
          placeholder="Type message to broadcast"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <select
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 mb-4"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option className="bg-black" value="info">Info</option>
          <option className="bg-black" value="warning">Warning</option>
          <option className="bg-black" value="critical">Critical</option>
        </select>

        <button
          onClick={sendNotification}
          disabled={
            sending || loadingMeta || isTargetInvalid || !message.trim()
          }
          className="w-full bg-white/90 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 py-2 text-black font-bold transition rounded-lg"
        >
          {sending ? "Sending…" : "Send Notification"}
        </button>
      </div>
    </div>
  );
}
