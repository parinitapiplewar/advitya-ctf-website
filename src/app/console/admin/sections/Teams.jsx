"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Trophy, Mail } from "lucide-react";

const Page = () => {
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

        const res = await fetch("/api/admin/teams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success || data.role !== "sudo") {
          router.push("/");
          return;
        }

        setTeams(data.teams || []);
      } catch (err) {
        console.error("Fetch error:", err);
        router.push("/");
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
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-300 font-medium">Loading All Teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Teams</h1>

        <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
          <Users className="w-4 h-4" />
          Total Teams: {teams.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <table className="min-w-full text-sm align-top">
          <thead className="bg-white/10 text-white/70 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">Score</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Email</th>
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

                {/* Score */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    {team.score}
                  </div>
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
                          m._id === team.leader
                            ? "text-yellow-400 font-medium"
                            : "text-blue-400"
                        }
                      >
                        {m._id === team.leader ? "Leader" : "Member"}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Emails */}
                <td className="px-4 py-4">
                  <div className="space-y-1 text-white/70">
                    {team.members.map((m) => (
                      <div key={m._id} className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-white/40" />
                        {m.email}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Solved Challenges */}
                <td className="px-4 py-4 w-[260px]">
                  {team.members.some((m) => m.solvedChallenges?.length > 0) ? (
                    <div className="max-h-32 overflow-y-auto flex flex-wrap gap-2">
                      {team.members.flatMap((m) =>
                        m.solvedChallenges?.map((ch) => (
                          <span
                            key={`${m._id}-${ch._id}`}
                            className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-300 border border-green-500/30 whitespace-nowrap"
                          >
                            {ch.name}
                          </span>
                        )),
                      )}
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

export default Page;
