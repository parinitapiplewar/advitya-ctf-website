"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Mail, UserStar, Trophy } from "lucide-react";

const page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/Auth/login");
      return;
    }

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/team", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setTeams(data.teams ? data.teams : []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">Loading All Teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Teams</h1>

        <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
          <Users className="w-4 h-4" />
          Total Teams: {teams.length}
        </span>
      </div>

      {/* body */}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <table className="min-w-full text-sm align-top">
          <thead className="bg-white/10 text-white/70 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left w-[260px]">
                Solved Challenges
              </th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team) => (
              <tr key={team._id} className="border-t border-white/10 align-top">
                {/* Team */}
                <td className="px-4 py-4 font-medium text-white">
                  {team.name}
                </td>

                {/* Members */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {team.members.map((m) => (
                      <div key={m._id} className="text-white">
                        {m.name}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Roles */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {team.members.map((m) => (
                      <div
                        key={m._id}
                        className={
                          m._id === team.leader._id
                            ? "text-yellow-400 font-medium"
                            : "text-blue-400"
                        }
                      >
                        {m._id === team.leader._id ? "Leader" : "Member"}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Solved Challenges */}
                <td className="px-4 py-4 w-[260px]">
                  {team.solvedChallenges && team.solvedChallenges.length > 0 ? (
                    <div className="max-h-32 overflow-y-auto flex flex-wrap gap-2">
                      {team.solvedChallenges.map((c) => (
                        <span
                          key={c.name}
                          className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-300 border border-green-500/30 whitespace-nowrap"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-white/40 italic">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
