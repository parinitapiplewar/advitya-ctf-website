import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user || !user.team) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User is not part of any team",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const team = await Team.findById(user.team).select("solvedChallenges");
    if (!team) {
      return new Response(
        JSON.stringify({ success: false, message: "Team not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        solved: team.solvedChallenges,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
