import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import Solve from "@/lib/models/Solve";

function generateBuckets(start, end, intervalMinutes = 10) {
  const buckets = [];
  let current = new Date(start);

  while (current <= end) {
    buckets.push(new Date(current));
    current = new Date(current.getTime() + intervalMinutes * 60 * 1000);
  }

  return buckets;
}

export async function GET() {
  await connectDB();

  const GRAPH_WINDOW_HOURS = 6;
  const BUCKET_INTERVAL_MINUTES = 10;

  const teams = await Team.find({}, "name").lean();
  const teamNames = teams.map((t) => t.name);

  const now = new Date();

  // FIXME :  NEED TO SET CTF START TIME IN UTC HERE... AI8

  const CTF_START = new Date(
    now.getTime() - 24 * 60 * 60 * 1000, // placeholder: 24h ago
  );

  const GRAPH_START = new Date(
    Math.max(
      CTF_START.getTime(),
      now.getTime() - GRAPH_WINDOW_HOURS * 60 * 60 * 1000,
    ),
  );

  const solves = await Solve.find({
    createdAt: { $lte: now },
  })
    .populate("team", "name")
    .lean();

  solves.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const buckets = generateBuckets(GRAPH_START, now, BUCKET_INTERVAL_MINUTES);

  const cumulative = {};
  teamNames.forEach((name) => {
    cumulative[name] = 0;
  });

  let solveIndex = 0;
  while (
    solveIndex < solves.length &&
    new Date(solves[solveIndex].createdAt) < GRAPH_START
  ) {
    const solve = solves[solveIndex];
    const teamName = solve.team?.name;

    if (teamName && cumulative[teamName] !== undefined) {
      cumulative[teamName] += solve.points;
    }
    solveIndex++;
  }

  const timeFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const data = buckets.map((bucket) => {
    while (
      solveIndex < solves.length &&
      new Date(solves[solveIndex].createdAt) <= bucket
    ) {
      const solve = solves[solveIndex];
      const teamName = solve.team?.name;

      if (teamName && cumulative[teamName] !== undefined) {
        cumulative[teamName] += solve.points;
      }
      solveIndex++;
    }

    const row = { time: timeFormatter.format(bucket) };
    teamNames.forEach((name) => {
      row[name] = cumulative[name];
    });

    return row;
  });

  return Response.json({
    success: true,
    teams: teamNames,
    data,
  });
}
