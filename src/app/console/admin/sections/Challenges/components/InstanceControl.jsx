import React from "react";
import { Shield, Loader2, Hammer } from "lucide-react";

const statusStyleMap = {
  pending: "bg-yellow-500/20 text-yellow-300",
  building: "bg-blue-500/20 text-blue-300",
  built: "bg-green-500/20 text-green-300",
  failed: "bg-red-500/20 text-red-300",
};

const InstanceControl = ({ instance, onBuildInstance, building }) => {
  const { buildStatus, buildError } = instance;

  return (
    <div className="rounded bg-white/5 p-3 space-y-3 w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-red-400 shrink-0" />
        <span className="text-xs font-medium text-white uppercase">
          Instance
        </span>
      </div>

      {/* STATUS BADGE */}
      <div className="flex flex-row justify-between items-start">
        <div
          className={`flex flex-row h-fill items-center gap-2 px-3 py-2 rounded text-xs font-semibold w-fit ${statusStyleMap[buildStatus]}`}
        >
          {buildStatus.toUpperCase()}
          {buildStatus === "building" && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
        </div>
        {buildStatus !== "building" && buildStatus !== "built" && (
          <button
            onClick={onBuildInstance}
            disabled={building}
            className="flex flex-row items-center gap-2 px-3 py-2 text-xs font-medium rounded bg-white/10 hover:bg-white hover:text-black transition w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Hammer className="w-4 h-4" />
            Build
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {buildStatus === "failed" && buildError && (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-2 text-xs text-red-300 break-words">
          <strong>Error:</strong> {buildError}
        </div>
      )}

      {/* BUILDING NOTE */}
      {buildStatus === "building" && (
        <p className="text-xs text-white/60">Building image… please wait. (This will take around 1-5 minutes or maybe 10 depending on chall size and all... if it says error.. reload and check for actual status.. chall will not be live until its build successfully )</p>
      )}
    </div>
  );
};

export default InstanceControl;
