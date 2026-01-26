"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Target, Users } from "lucide-react";
import MultiTeamScore from "@/components/ScoreChart";
import NoParticipant from "./component/NoParticipant";
import FullRanking from "./component/FullRanking";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setChartError(null);

      try {
        const authToken = localStorage.getItem("token");

        // -------- Leaderboard fetch --------
        const leaderboardRes = await fetch("/api/leaderboard", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const leaderboardJson = await leaderboardRes.json();

        if (!leaderboardRes.ok || !leaderboardJson.success) {
          throw new Error(
            leaderboardJson.message || "Failed to load leaderboard",
          );
        }

        setLeaderboardData(leaderboardJson.leaderboard);
        setCurrentUserInfo(leaderboardJson.currentUser || null);

        // -------- Chart fetch ---------
        try {
          const chartRes = await fetch("/api/stats/score-progression");
          const chartJson = await chartRes.json();

          if (!chartRes.ok || !chartJson.success) {
            throw new Error(chartJson.message || "Failed to load score chart");
          }

          setChartData(chartJson.data);
          setTeams(chartJson.teams);
        } catch (chartErr) {
          console.error("Chart load failed:", chartErr);
          setChartError("Score progression unavailable");
        }
      } catch (err) {
        setError(err.message || "Connection failed");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">
            Loading leaderboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-semibold text-lg mb-2">Error</div>
          <div className="text-slate-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <h1 className="space-y-1 text-3xl font-bold text-white">
            Team Leaderboard
          </h1>

          {currentUserInfo?.rank && (
            <div className="gap-2 flex">
              <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl text-sm font-medium ">
                <Users className="w-4 h-4"></Users>
                <span>Your Team Rank : {currentUserInfo.rank}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {chartError && (
        <div className="max-w-6xl mx-auto px-6 mb-6 text-sm text-gray-400">
          {chartError}
        </div>
      )}

      {!chartError && chartData.length > 0 && teams.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="bg-[#191919] rounded-xl p-4">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Score Progression
            </h2>

            <MultiTeamScore data={chartData} teams={teams} />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {leaderboardData.length === 0 ? (
          <NoParticipant />
        ) : (
          <>
            {/* Full Rankings */}
            <FullRanking
              leaderboardData={leaderboardData}
              currentUserInfo={currentUserInfo}
            />

            {/* <div className="bg-[#191919] rounded-xl p-6 shadow-lg border border-white/20 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Statistics
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {leaderboardData.length}
                  </div>
                  <div className="text-sm text-white/50">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">
                    {Math.max(...leaderboardData.map((u) => u.score))}
                  </div>
                  <div className="text-sm text-white/50">Highest Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-300 mb-1">
                    {Math.round(
                      leaderboardData.reduce((sum, u) => sum + u.score, 0) /
                        leaderboardData.length,
                    )}
                  </div>
                  <div className="text-sm text-white/50">Average</div>
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
