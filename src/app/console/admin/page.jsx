"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Flag,
  Shield,
  Bell,
  Terminal,
  Settings,
} from "lucide-react";

import Challenges from "@/components/admin/Challenges";
import UsersComponent from "@/components/admin/Users";
import Teams from "@/components/admin/Teams";
import Logs from "@/components/admin/Logs";
import Notifications from "@/components/admin/Notifications";
import Controls from "@/components/admin/Controls";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const tabs = [
  {
    id: "controls",
    label: "Controls",
    icon: Settings,
    component: Controls,
  },
  { id: "challenges", label: "Challenges", icon: Flag, component: Challenges },
  { id: "users", label: "Users", icon: User, component: UsersComponent },
  { id: "teams", label: "Teams", icon: Users, component: Teams },
  {
    id: "notification",
    label: "Notification",
    icon: Bell,
    component: Notifications,
  },
  { id: "logs", label: "Logs", icon: Terminal, component: Logs },
];

export default function Page() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (role !== "sudo") {
      router.push("/");
    }

    setLoading(false);
  }, [user, router]);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  console.log("AC", activeTab);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">
            Loading Admin Portal...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role == "sudo" && (
        <div>
          {/* NAV */}
          <nav className="px-8 flex justify-between w-screen mt-4 lg:mt-0 border-b border-white/10 pb-4">
            <div className="flex flex-wrap space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? "text-black bg-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-6 h-6" />
                  <span className="text-md font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="hidden gap-2 lg:flex items-center justify-center font-semibold text-xl ">
              <Shield className="w-6 h-6 "></Shield>
              <span>Admin Panel</span>
            </div>
          </nav>

          {/* CONTENT */}
          <section className="px-8 py-6">
            {ActiveComponent && <ActiveComponent />}
          </section>
        </div>
      )}
    </>
  );
}
