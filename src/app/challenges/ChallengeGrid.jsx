"use client";

import React from "react";
import { Trophy } from "lucide-react";
import ChallengeCard from "./ChallengeCard";

const ChallengeGrid = ({
  challenges,
  selectedCategory,
  solvedChallenges,
  categories,
  onChallengeClick,
}) => {
  if (challenges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-white/80 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/80 mb-2">
            {selectedCategory === "all"
              ? "No challenges available"
              : `No challenges found in ${categories.find((cat) => cat.value === selectedCategory)?.label} category`}
          </h3>
          <p className="text-white/60">
            {selectedCategory === "all"
              ? "Check back later for new challenges"
              : "Try selecting a different category"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => {
          const isSolved = solvedChallenges.has(challenge._id);
          return (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              isSolved={isSolved}
              onClick={() => onChallengeClick(challenge)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeGrid;

