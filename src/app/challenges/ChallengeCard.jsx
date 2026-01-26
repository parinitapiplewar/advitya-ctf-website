"use client";

import React from "react";
import { Trophy, User, Check, ExternalLink } from "lucide-react";

const ChallengeCard = ({ challenge, isSolved, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#212121] border rounded-xl p-6 cursor-pointer hover:shadow-lg ${
        isSolved
          ? "border-green-500/30 bg-gradient-to-br from-green-900/20 to-[#212121] hover:border-green-500/50"
          : "border-white/10 hover:border-white/20 hover:bg-[#232323]"
      }`}
    >
        {/* chall name and author */}
      <div className="flex flex-row items-start justify-between mb-4">
        <span className="flex flex-row items-baseline mr-2 truncate gap-2">
          <span className="text-xl font-bold text-white">{challenge.name}</span>
          <span className="flex-1 truncate text-xs text-white/80">
            {" "}
            by {challenge.author}
          </span>
        </span>

        {isSolved && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-900/50 text-green-300 text-xs font-medium rounded-lg flex-shrink-0">
            <Check className="w-3 h-3" />
            <span className="hidden sm:inline">Solved</span>
          </div>
        )}
      </div>

      {/* Category and Points */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-white/80 text-black text-xs font-bold rounded-full uppercase ">
          {challenge.category}
        </span>
        <div className="flex items-center gap-1 text-white">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-lg">{challenge.value}</span>
          <span className="text-sm text-white/70">pts</span>
        </div>
      </div>

      {/* Click indicator */}
      <div className="flex items-center justify-center mt-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <ExternalLink className="w-3 h-3" />
          <span>Click to view details</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
