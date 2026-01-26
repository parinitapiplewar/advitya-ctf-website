import React, { memo } from "react";

const TableRow = memo(function TableRow({
  participant,
  position,
  isCurrentUser,
}) {
  return (
    <tr
      className={`
        hover:bg-[#252525] transition-colors border-b-1 border-b-white/20`}
    >
      {/* Rank */}
      <td className="px-5 py-3 w-24 text-center text-xl text-white  font-mono">
        #{position}
      </td>

      {/* Team */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className={`font-semibold truncate max-w-[320px]
             text-white`}
          >
            {participant.name}
          </span>

          {isCurrentUser && (
            <span className="px-2 py-0.5 bg-white/90 text-black  text-sm font-semibold rounded-full">
              Your Team
            </span>
          )}
        </div>
      </td>

      {/* Score */}
      <td className="px-5 py-3 w-32 text-right text-blue-500 text-lg font-mono">
        {participant.score}
      </td>
    </tr>
  );
});

const FullRanking = ({ leaderboardData = [], currentUserInfo }) => {
  return (
    <div className="rounded-md overflow-hidden">
      <table className="w-full table-fixed">
        {/* Header */}
        <thead>
          <tr className="border-b-1 border-b-white/20">
            <th className="px-5 py-4 w-24 text-left text-sm uppercase tracking-widest text-white">
              Rank
            </th>
            <th className="px-5 py-4 text-left text-sm uppercase tracking-widest text-white">
              Team
            </th>
            <th className="px-5 py-4 w-32 text-right text-sm uppercase tracking-widest text-white">
              Score
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {leaderboardData.length === 0 && (
            <tr>
              <td colSpan={3} className="px-5 py-8 text-center text-white">
                No teams yet
              </td>
            </tr>
          )}

          {leaderboardData.map((participant, index) => {
            const position = index + 1;
            const isCurrentUser =
              currentUserInfo?.teamId === participant.teamId;

            return (
              <TableRow
                key={participant.teamId}
                participant={participant}
                position={position}
                isCurrentUser={isCurrentUser}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FullRanking;
