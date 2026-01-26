"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-black/90 border border-white/20 rounded-lg px-3 py-2 text-sm">
      <div className="text-slate-300 mb-1">Time: {label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function MultiTeamScore({ data, teams }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />

        <XAxis
          dataKey="time"
          stroke="#cbd5e1"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          stroke="#cbd5e1"
          tick={{ fontSize: 12 }}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff20" }} />

        {teams.map((team, index) => (
          <Line
            key={team}
            type="monotone"
            dataKey={team}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={true}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
