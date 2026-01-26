"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, Users, Calendar, CheckCircle, Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Access denied");
        }

        setUsers(data.users);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, {
          theme: "dark",
          position: "bottom-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">Loading All Users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">All Users</h1>
        </div>
        <div className="gap-2 flex">
          <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl text-sm font-medium ">
            <Users className="w-4 h-4"></Users>
            <span>Total Users: {users.length}</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10 text-white/70 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">Solved</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-white/40" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-white/70">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/30" />
                    {user.email}
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3 ">
                  {user.role === "sudo" ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70 border border-white/20">
                      USER
                    </span>
                  )}
                </td>

                {/* Team */}
                <td className="px-4 py-3">
                  {user.team ? (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white/40" />
                      {user.team.name}
                    </div>
                  ) : (
                    <span className="text-white/40">—</span>
                  )}
                </td>

                {/* Solved */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {user.solvedChallenges?.length || 0}
                  </div>
                </td>

                {/* Created */}
                <td className="px-4 py-3 text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/30" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
