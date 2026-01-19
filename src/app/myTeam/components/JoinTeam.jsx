"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function JoinTeam({ onJoined }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  /* ---------------- FETCH TEAM NAMES ---------------- */

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/team/names");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setTeams(data.teams || []);
      } catch (err) {
        toast.error("Failed to load teams", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 3000,
          toastId: "myTeam",
        });
      }
    };

    fetchTeams();
  }, []);

  /* ---------------- JOIN TEAM ---------------- */

  const joinTeam = async () => {
    if (!selectedTeam || !password) {
      toast.error("All Fields Are Required", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          teamName: selectedTeam,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Team Joined Successfully", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      onJoined();

      login(data.token, data.user);

    } catch (err) {
      toast.error(err?.message || "Failed to join team", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white flex items-center justify-center">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
            Join Team
          </h1>
          <p className="text-gray-400 mt-1">
            Select a team and enter the password
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#191919] border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Team Dropdown */}
            <div>
              <label className="flex text-sm font-medium text-gray-300 mb-2">
                Select Team
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-3
                    bg-white/10
                    border border-white/20
                    rounded-lg
                    text-white
                    focus:outline-none
                    focus:border-white/40
                    
                  "
                >
                  <option
                    className="bg-black text-white text-lg "
                    value=""
                    disabled
                  >
                    -- Select a team --
                  </option>
                  {teams.map((team) => (
                    <option
                      key={team.name}
                      value={team.name}
                      className="bg-black text-white text-lg"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="flex text-sm font-medium text-gray-300 mb-2">
                Team Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full pl-12 pr-12 py-3
                    bg-white/10
                    border border-white/20
                    rounded-lg
                    text-white
                    placeholder-gray-400
                    focus:outline-none
                    focus:border-white/40
                  "
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={joinTeam}
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2
                py-3
                rounded-lg
                bg-white
                text-black
                font-medium
                hover:bg-gray-200
                disabled:opacity-50
                transition
              "
            >
              {loading ? (
                <span>Joining...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Join Team
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
