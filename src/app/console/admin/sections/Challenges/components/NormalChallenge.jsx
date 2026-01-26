"use client";

import { Download, Shield, Eye, EyeOff, Trophy, Trash2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: ["className"],
    code: ["className"],
  },
};

export default function NormalChallenge({
  challenge,
  togglingId,
  onToggleVisibility,
  onDeleteChallenge,
  deletingId,
}) {
  const [visibleFlags, setVisibleFlags] = useState(new Set());

  const toggleFlagVisibility = (challengeId) => {
    setVisibleFlags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className=" flex flex-row gap-2 px-2 py-1 bg-white/80 text-black text-xs rounded-full ">
            <span className=" font-bold uppercase">{challenge.category} </span>
            <span className="font-semibold">Normal</span>
          </span>

          <div className="flex items-center gap-1 px-2 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
            <Trophy className="w-3 h-3" />
            {challenge.value}
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
              challenge.visible
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {challenge.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            {challenge.visible ? "Live" : "Hidden"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* <button
            onClick={() => onEdit(challenge)}
            className="p-2 text-white/70 hover:text-white rounded"
          >
            <Edit3 className="w-4 h-4" />
          </button> */}

          <button
            onClick={() => onToggleVisibility(challenge._id, challenge.visible)}
            disabled={togglingId === challenge._id}
            className={`p-2 rounded ${
              challenge.visible
                ? "text-red-400 hover:text-red-300"
                : "text-green-400 hover:text-green-300"
            }`}
          >
            {togglingId === challenge._id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : challenge.visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onDeleteChallenge(challenge._id)}
            disabled={deletingId === challenge._id}
            className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            {deletingId === challenge._id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1  gap-4">
        <div>
          <div className="flex flex-row gap-2 justify-start items-baseline mb-2">
            <h3 className="text-2xl font-bold text-white mb-1">
            {challenge.name}
          </h3>
          <p className="text-lg text-white/90 mb-2">by {challenge.author}</p>
          </div>
          <div className=" markdown prose prose-sm prose-invert max-w-none bg-white/5 rounded-lg p-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
            >
              {challenge.description}
            </ReactMarkdown>
          </div>
        </div>

        <div className="space-y-3">
          {/* Flag */}
          <div className="bg-white/5 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium text-white uppercase">
                  Flag
                </span>
              </div>
              <button
                onClick={() => toggleFlagVisibility(challenge._id)}
                className="p-1 text-white/70 hover:text-white"
              >
                {visibleFlags.has(challenge._id) ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
            </div>

            <div className="bg-black/20 rounded p-2">
              <code className="text-xs text-slate-200 font-mono break-all">
                {visibleFlags.has(challenge._id)
                  ? challenge.flag
                  : "•".repeat(Math.min(challenge.flag.length, 20))}
              </code>
            </div>
          </div>

          {/* File */}
          {challenge.file_url && (
            <div className="bg-white/5 rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">File</p>
                  <p className="text-xs text-white/70">Download available</p>
                </div>
                <a
                  href={challenge.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-white/90 hover:bg-white text-black px-3 py-2 rounded-full text-xs font-medium"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
