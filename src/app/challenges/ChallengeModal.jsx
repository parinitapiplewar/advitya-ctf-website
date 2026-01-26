"use client";

import React, { useEffect } from "react";
import { X, Download, Trophy, User, Check } from "lucide-react";
import InstancePanel from "@/app/challenges/InstancePanel";
import MarkdownRenderer from "./MarkdownRenderer";
import FlagSubmit from "./FlagSubmit";

const ChallengeModal = ({
  challenge,
  isSolved,
  flagInput,
  onFlagChange,
  onKeyPress,
  onSubmit,
  onClose,
  submittingFlag,
}) => {
  useEffect(() => {
    if (!challenge) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [challenge]);

  if (!challenge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-[95vw] h-[95vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="pr-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-bold text-white break-words">
                  {challenge.name}
                </span>
                <span className="text-md text-white/80 truncate">
                  by {challenge.author}
                </span>
              </span>

              {isSolved && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/30">
                  <Check className="w-4 h-4" />
                  Solved
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-white text-black text-sm font-semibold rounded-full uppercase tracking-wide">
                {challenge.category}
              </span>

              <span className="flex items-center gap-1.5 text-white/80">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-lg text-white">
                  {challenge.value}
                </span>
                <span className="text-sm text-white/60">points</span>
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="h-[calc(95vh-120px)] overflow-y-auto px-6 py-4">
          {/* Responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* LEFT: Description */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Description
              </h3>

              <MarkdownRenderer content={challenge.description} />
            </div>

            {/* RIGHT: Actions (STICKY) */}
            <div className="lg:sticky space-y-4">
              {isSolved ? (
                <div className="flex items-center justify-center py-8 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-300 mb-1">
                      Challenge Completed!
                    </h3>
                    <p className="text-green-400/70 text-sm">
                      Your Team has successfully solved this challenge
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {challenge.file_url && (
                    <a
                      href={challenge.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg border border-white/20"
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </a>
                  )}

                  {challenge.type === "instance" && (
                    <InstancePanel challengeId={challenge._id} />
                  )}

                  <div className="pt-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                      Submit Flag
                    </h3>
                    <FlagSubmit
                      challengeId={challenge._id}
                      flagInput={flagInput}
                      onFlagChange={onFlagChange}
                      onKeyPress={onKeyPress}
                      onSubmit={onSubmit}
                      submittingFlag={submittingFlag}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
