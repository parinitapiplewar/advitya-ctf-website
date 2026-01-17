import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Mail, UserStar } from "lucide-react";

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

        const res = await fetch("/api/admin/teams", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          if (data.role !== "sudo") {
            router.push("/");
          }
          setTeams(data.teams ? data.teams : []);
        } else {
          router.push("/");
        }
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
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">Loading All Teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">
            Teams (Admin)
          </h1>
        </div>
        <div className="gap-2 flex">
          <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl text-sm font-medium ">
            <Users className="w-4 h-4"></Users>
            <span>Total Teams: {teams.length}</span>
          </span>
        </div>
      </div>

      {/* body */}
      <div>
        {teams.length === 0 ? (
          <div className="mt-8 text-center text-slate-400">No teams found.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-[#191919] border border-white/20 rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-bold text-white">{team.name}</h2>
                  <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                    Score: {team.score}
                  </span>
                </div>
                <h3 className="font-semibold mb-3 text-white">Members</h3>
                <ul className="space-y-2">
                  {team.members.map((member) => (
                    <li
                      key={member._id}
                      className="flex flex-col items-start gap-4 px-4 py-3 bg-white/5 rounded "
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-white text-lg flex gap-2">
                          <span>{member.name}</span>
                          {member._id === team.leader ? (
                            <span className="text-yellow-400">(Leader)</span>
                          ) : (
                            <span className="text-blue-400">(Member)</span>
                          )}
                        </span>

                        <span className="flex items-center text-white/80 text-sm">
                          <Mail className="w-4 h-4 mr-1" />
                          {member.email}
                        </span>

                        <span className="flex items-center text-white/60 text-xs mt-1">
                          <UserStar className="w-4 h-4 mr-1" />
                          {member._id}
                        </span>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 max-w-[70%]">
                        {member.solvedChallenges &&
                        member.solvedChallenges.length > 0 ? (
                          member.solvedChallenges.map((ch) => (
                            <span
                              key={ch._id}
                              className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-300 border border-green-500/30 whitespace-nowrap"
                            >
                              {ch.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-white/40 italic">
                            No Challenges Solved
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
