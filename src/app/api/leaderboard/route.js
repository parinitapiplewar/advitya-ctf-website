import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import jwt from "jsonwebtoken";
import logger from "@/utils/logger";

export async function GET(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "Unknown";

  try {
    await connectDB();

    const teams = await Team.find({})
      .sort({ score: -1, updatedAt: 1 })
      .select("_id name score")
      .lean();

    const leaderboard = teams.map((team, index) => ({
      rank: index + 1,
      teamId: team._id.toString(),
      name: team.name,
      score: team.score,
    }));

    let currentUser = null;
    const authHeader = req.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userTeamId = decoded.team;

        if (userTeamId) {
          const idx = leaderboard.findIndex((t) => t.teamId === userTeamId);

          if (idx !== -1) {
            currentUser = {
              rank: idx + 1,
              teamId: leaderboard[idx].teamId,
              score: leaderboard[idx].score,
            };
          }
        }
      } catch (err) {
        console.log("Leaderboard Error: ", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        leaderboard,
        currentUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.log("Leaderboard Error: ", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
