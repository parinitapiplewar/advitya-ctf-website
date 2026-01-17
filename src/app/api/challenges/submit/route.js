import connectDB from "@/lib/db";
import Challenge from "@/lib/models/Challenge";
import Team from "@/lib/models/Team";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { rateLimit } from "@/lib/rateLimiter";
import { NextResponse } from "next/server";

const SubmitLimiter = rateLimit({ windowMs: 60_000, max: 5 });

export async function POST(req) {
  try {
    if (!SubmitLimiter(req)) {
      return NextResponse.json(
        { success: false, message: "Too many attempts, try again later." },
        { status: 429 }
      );
    }

    const { challengeId, flag } = await req.json();

    if (!challengeId || !flag) {
      return NextResponse.json(
        { success: false, message: "Missing entries" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user || !user.team) {
      return NextResponse.json(
        { success: false, message: "Join a team first" },
        { status: 403 }
      );
    }

    const [team, challenge] = await Promise.all([
      Team.findById(user.team),
      Challenge.findById(challengeId),
    ]);

    if (!team || !challenge) {
      return NextResponse.json(
        { success: false, message: "Team or Challenge not found" },
        { status: 404 }
      );
    }

    const teamAlreadySolved =
      team.solvedChallenges.some((id) => id.equals(challenge._id)) ||
      challenge.solvedBy.some((s) => s.team.equals(team._id));

    if (teamAlreadySolved) {
      return NextResponse.json(
        { success: false, message: "Your team already solved this challenge" },
        { status: 400 }
      );
    }

    // ❌ Incorrect flag
    if (flag !== challenge.flag) {
      return NextResponse.json(
        { success: false, message: "Incorrect flag" },
        { status: 400 }
      );
    }

    team.solvedChallenges.push(challenge._id);
    team.score += challenge.value;

    challenge.solvedBy.push({
      team: team._id,
      user: user._id,
      solvedAt: new Date(),
    });

    user.solvedChallenges.push(challenge._id);

    await Promise.all([team.save(), challenge.save(), user.save()]);

    return NextResponse.json(
      {
        success: true,
        message: "Solved successfully!",
        newScore: team.score,
      },
      { status: 200 }
    );
  } catch (err) {
    // Mongo duplicate key → team already solved (race-safe)
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Your team already solved this challenge" },
        { status: 400 }
      );
    }

    console.log("CHALLENGE SUBMIT ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
