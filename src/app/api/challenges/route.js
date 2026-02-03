import connectDB from "@/lib/db";
import Challenge from "@/lib/models/Challenge";
import Team from "@/lib/models/Team";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired Session. Login Again...",
        },
        { status: 403 },
      );
    }
    await connectDB();

    const user = await User.findById(decoded.userId).select("team role").lean();

    console.log(user);
    

    if (user.role === "sudo") {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Admin should not access challenges here. Go to admin page to access challs.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!user.team) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Join a team First",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    const challenges = await Challenge.find(
      { visible: true },
      "-flag -visible -createdAt -updatedAt -solvedBy -instance",
    ).lean();

    let solved = [];

    const team = await Team.findById(user.team)
      .select("solvedChallenges")
      .lean();

    if (team?.solvedChallenges) {
      solved = team.solvedChallenges.map(String);
    }

    return NextResponse.json(
      {
        success: true,
        challenges,
        solved,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Challenges API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
