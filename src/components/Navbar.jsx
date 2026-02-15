"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

import {
  Menu,
  X,
  Flag,
  Trophy,
  LogOut,
  Settings,
  Users,
  Bell,
  User,
  Scale,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const pathname = usePathname();

  const { logout, isAuthenticated, user, role, token } = useAuth();

  const navLinks = [
    { name: "Challenges", href: "/challenges", icon: Flag },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Rules", href: "/rules", icon: Scale },
    { name: "MyTeam", href: "/myTeam", icon: Users },
  ];

  const isActive = (href) => pathname === href;

  // const fetchTeamData = async () => {
  //   setIsLoadingTeam(true);
  //   try {
  //     const response = await fetch("/api/auth/get-team", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       setTeamData(data.data);
  //     } else {
  //       toast.error("Failed to load team data", {
  //         theme: "dark",
  //         position: "bottom-right",
  //         autoClose: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching team data:", error);
  //     toast.error("Error loading team data", {
  //       theme: "dark",
  //       position: "bottom-right",
  //       autoClose: 3000,
  //     });
  //   } finally {
  //     setIsLoadingTeam(false);
  //   }
  // };

  // const handleUserClick = async () => {
  //   setIsTeamDialogOpen(true);
  //   if (!teamData) {
  //     await fetchTeamData();
  //   }
  // };

  // const closeDialog = () => {
  //   setIsTeamDialogOpen(false);
  // };

  // const TeamDialog = () => {
  //   if (!isTeamDialogOpen) return null;

  //   return (
  //     <div className="fixed inset-0 bg-black/20 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-[100] p-4">
  //       <div className="bg-[#212121] border border-white/20 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
  //         {/* Header */}
  //         <div className="flex items-center justify-between p-6 border-b border-white/20">
  //           <div className="flex items-center space-x-2">
  //             <Users className="h-6 w-6 text-[#E50914]" />
  //             <h2 className="text-xl font-bold text-white">Team Details</h2>
  //           </div>
  //           <button
  //             onClick={closeDialog}
  //             className="text-slate-400 hover:text-[#E50914] transition-colors"
  //           >
  //             <X className="h-5 w-5" />
  //           </button>
  //         </div>

  //         {/* Content */}
  //         <div className="p-6">
  //           {isLoadingTeam ? (
  //             <div className="flex items-center justify-center py-8">
  //               <Loader2 className="h-8 w-8 text-[#E50914] animate-spin" />
  //               <span className="ml-2 text-slate-300">
  //                 Loading team data...
  //               </span>
  //             </div>
  //           ) : teamData ? (
  //             <div className="space-y-6">
  //               {/* Team Name */}
  //               <div className="text-center">
  //                 <h3 className="text-2xl font-bold text-[#E50914] mb-1">
  //                   {teamData.teamName}
  //                 </h3>
  //                 <p className="text-sm text-slate-300">Your Team</p>
  //               </div>

  //               {/* Team Leader */}
  //               <div className="bg-[#2a2121] rounded-lg p-4 border border-white/20">
  //                 <div className="flex items-center space-x-3 mb-3">
  //                   <Crown className="h-5 w-5 text-yellow-400" />
  //                   <h4 className="text-lg font-semibold text-white">
  //                     Team Leader
  //                   </h4>
  //                 </div>
  //                 <div className="space-y-2">
  //                   <div className="flex items-center space-x-2">
  //                     <UserCheck className="h-4 w-4 text-green-400" />

  //                     <span className="text-white font-medium">
  //                       {teamData.leader.name}
  //                     </span>
  //                   </div>
  //                   <div className="flex items-center space-x-2">
  //                     <Mail
  //                       className="h-4 w-4 text-blue-400 "
  //                       onClick={() => setShowImage(true)}
  //                     />

  //                     <span className="text-slate-300 text-sm">
  //                       {teamData.leader.email}
  //                     </span>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Team Members */}
  //               {teamData.members && teamData.members.length > 0 && (
  //                 <div className="bg-[#2a2121] rounded-lg p-4 border border-white/20">
  //                   <div className="flex items-center space-x-3 mb-4">
  //                     <Users className="h-5 w-5 text-[]" />
  //                     <h4 className="text-lg font-semibold text-white">
  //                       Team Members ({teamData.members.length})
  //                     </h4>
  //                   </div>
  //                   <div className="space-y-3">
  //                     {teamData.members.map((member, index) => (
  //                       <div
  //                         key={index}
  //                         className="flex items-center justify-between p-3 bg-[2a2121] rounded-lg border border-white/10"
  //                       >
  //                         <div className="space-y-1">
  //                           <div className="flex items-center space-x-2">
  //                             <CircleUser className="h-4 w-4 text-red-400" />
  //                             <span className="text-white font-medium">
  //                               {member.name}
  //                             </span>
  //                           </div>
  //                           <div className="flex items-center space-x-2">
  //                             <Mail className="h-4 w-4 text-red-400" />
  //                             <span className="text-slate-300 text-sm">
  //                               {member.email}
  //                             </span>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}

  //               {/* No team members */}
  //               {(!teamData.members || teamData.members.length === 0) && (
  //                 <div className="text-center py-4">
  //                   <Users className="h-12 w-12 text-slate-300 mx-auto mb-2" />
  //                   <p className="text-slate-200">No team members found</p>
  //                 </div>
  //               )}
  //             </div>
  //           ) : (
  //             <div className="text-center py-8">
  //               <Users className="h-12 w-12 text-slate-300 mx-auto mb-2" />
  //               <p className="text-slate-200">No team data available</p>
  //             </div>
  //           )}
  //           {showImage && (
  //             <div className="flex justify-center mt-4">
  //               <img
  //                 src="/devnull.jpeg"
  //                 alt="Preview"
  //                 className="rounded-lg border border-white/20 max-h-64"
  //               />
  //             </div>
  //           )}
  //         </div>

  //         {/* Footer */}
  //         <div className="flex justify-end p-6 border-t border-white/10">
  //           <button
  //             onClick={closeDialog}
  //             className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
  //           >
  //             Close
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      <nav className="bg-[#121212] border-b border-white/20 shadow-lg fixed min-w-screen z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center text-xl mr-8"
              >
                {/* <Image
                  src="/hacksecure-logo.png"
                  alt="HackSecure 2025"
                  width={80}
                  height={80}
                  priority
                /> */}
                CyberCarnival
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-2 mx-16">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-sm text-sm font-semibold transition-all duration-200 group ${
                      active
                        ? "text-black bg-white/90 "
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                        active ? "text-black" : "group-hover:text-white"
                      }`}
                    />
                    {link.name}
                  </Link>
                );
              })}
              {role === "sudo" && (
                <Link
                  href={"/console/admin"}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                    isActive("/console/admin")
                      ? "text-black bg-white/90 "
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Settings
                    className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                      isActive("/console/admin")
                        ? "text-black"
                        : "group-hover:text-white"
                    }`}
                  />
                  {"Admin"}
                </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            {!isAuthenticated ? (
              <div className="hidden xl:flex items-center space-x-4">
                <Link
                  href="/Auth/login"
                  className="px-5 py-2 text-sm font-semibold text-black border border-white  rounded-4xl transition-all duration-200 bg-white"
                >
                  Login
                </Link>
                <Link
                  href="/Auth/register"
                  className="px-5 py-2 text-sm font-semibold rounded-4xl transition-all duration-200 text-white bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="hidden xl:flex items-center space-x-4">
                {/* User Button */}
                {/* <button
                  // onClick={handleUserClick}
                  className="flex items-center space-x-2 px-3 py-2 bg-[#212121]/60 hover:bg-[#212121]/80 backdrop-blur-sm border border-[#E50914]/30 hover:border-[#E50914]/60 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                > */}

                {/* </button> */}

                <div className="flex items-center gap-2 justify-center">
                  <User className="h-4 w-4 text-white" />
                  <span className="text-sm font-semibold text-white whitespace-nowrap">
                    {user.name}
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully!", {
                      theme: "dark",
                      position: "bottom-right",
                      autoClose: 3000,
                    });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/90 hover:bg-red-900 text-black hover:text-white rounded-lg transition-all duration-200 focus:outline-none "
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="xl:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-[#FF1A1A] hover:bg-[#121212] transition-all duration-200 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6 transition-colors duration-200 text-[#E50914]" />
                ) : (
                  <Menu className="block h-6 w-6 transition-colors duration-200 group-hover:text-[#FF1A1A]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`xl:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#121212] border-t border-white/20">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
            flex items-center px-3 py-3 rounded-md text-base font-medium transition
            ${
              active
                ? "bg-white/10 text-white"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }
          `}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  />
                  {link.name}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="pt-4 pb-3 border-t border-white/10">
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-3 px-3">
                  <Link
                    href="/Auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="
              flex items-center justify-center
              px-6 py-3
              text-sm font-medium
              text-black
              bg-white
              rounded-lg
              hover:bg-gray-200
              transition
            "
                  >
                    Login
                  </Link>

                  <Link
                    href="/Auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="
              flex items-center justify-center
              px-6 py-3
              text-sm font-medium
              text-white
              bg-white/10
              border border-white/20
              rounded-lg
              hover:bg-white/20
              transition
            "
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-3">
                  {/* User */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium text-white">
                      {user.name}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully!", {
                        theme: "dark",
                        position: "bottom-right",
                        autoClose: 3000,
                      });
                      setIsMenuOpen(false);
                    }}
                    className="
              flex items-center justify-center gap-2
              px-6 py-3
              bg-white
              text-black
              rounded-lg
              font-medium
              hover:bg-gray-200
              transition
            "
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Team Dialog */}
      {/* <TeamDialog /> */}
    </>
  );
}
