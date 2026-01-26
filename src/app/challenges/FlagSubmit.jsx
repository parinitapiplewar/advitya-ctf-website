"use client";

import React from "react";
import { Flag } from "lucide-react";

const FlagSubmit = ({
  challengeId,
  flagInput,
  onFlagChange,
  onKeyPress,
  onSubmit,
  submittingFlag,
}) => {
  const isSubmitting = submittingFlag === challengeId;
  const isDisabled = isSubmitting || !flagInput?.trim();

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={flagInput || ""}
        onChange={(e) => onFlagChange(e.target.value)}
        onKeyPress={(e) => onKeyPress(e, challengeId)}
        placeholder="0x00{...}"
        className="w-full px-4 py-3 bg-[#292929] border border-white/20 rounded-lg text-slate-100 placeholder-white/40 focus:outline-0 focus:border-white/80 break-all"
        disabled={isSubmitting}
      />
      <button
        onClick={() => onSubmit(challengeId)}
        disabled={isDisabled}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/90 hover:bg-white disabled:bg-white/70 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            <span className="break-words">Checking Flag...</span>
          </>
        ) : (
          <>
            <Flag className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Submit Flag</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FlagSubmit;

