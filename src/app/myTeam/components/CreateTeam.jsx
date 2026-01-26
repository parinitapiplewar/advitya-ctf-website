"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Users, Lock, Shield, Eye, EyeOff, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CreateTeam({ onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const createTeam = async () => {
    if (!teamName || !password || !confirmPassword) {
      toast.error("All Fields Are Required", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password do not Match", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          teamName,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.token, data.user);

      toast.success("Team Created Successfully", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "myTeam",
      });
      onCreated(data.team);

      window.location.reload();
    } catch (err) {
      console.log(err);

      toast.error(err.message || "Error creating team...", {
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
    <div className="text-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
            Create Team
          </h1>
          <p className="text-gray-400 mt-1">Create your team for the CTF</p>
        </div>

        {/* Card */}
        <div className="bg-[#191919] border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="flex text-sm font-medium text-gray-300 mb-2">
                Team Name
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="My Awesome Team"
                  className="
                    w-full pl-12 pr-4 py-3
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
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
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

            {/* Confirm Password */}
            <div>
              <label className="flex text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex text-lg text-red-600 mb-4">
              Remember this password, as you'll need it to invite members!
            </label>

            {/* Action */}
            <button
              onClick={createTeam}
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
                <span>Creating...</span>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Team
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
