import React from "react";
import { Trophy } from "lucide-react";

const NoParticipant = () => {
  return (
    <div className="bg-[#1b1b1b] rounded-xl p-12 text-center border border-[#3a2c2c]">
      <div className="w-16 h-16 bg-[#2a2323] rounded-full flex items-center justify-center mx-auto mb-4">
        <Trophy className="w-8 h-8 text-[#a39b9b]" />
      </div>
      <h3 className="text-xl font-semibold text-[#d6d6d6] mb-2">
        No participants yet
      </h3>
      <p className="text-[#9c8e8e]">Be the first to join the competition</p>
    </div>
  );
};

export default NoParticipant;
