import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Team from "@/lib/models/Team";

export async function POST(req) {
  try {
    /* ---------------- AUTH ---------------- */

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    /* ---------------- INPUT ---------------- */

    const { teamName, password } = await req.json();

    if (!teamName || !password) {
      return NextResponse.json(
        { success: false, message: "Team name and password required" },
        { status: 400 }
      );
    }

    /* ---------------- DB ---------------- */

    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "sudo") {
      return NextResponse.json(
        { success: false, message: "Admin Should not join Team" },
        { status: 401 }
      );
    }

    if (user.team) {
      return NextResponse.json(
        { success: false, message: "User already in a team" },
        { status: 409 }
      );
    }

    const team = await Team.findOne({ name: teamName });
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    /* ---------------- PASSWORD CHECK ---------------- */

    const isMatch = await team.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid team password" },
        { status: 401 }
      );
    }

    /* ---------------- JOIN TEAM ---------------- */

    team.members.push(user._id);
    await team.save();

    user.team = team._id;
    await user.save();

    /* ---------------- RESPONSE ---------------- */

    return NextResponse.json(
      {
        success: true,
        team: {
          _id: team._id,
          name: team.name,
          captainId: team.captainId,
          score: team.score,
          members: team.members,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("TEAM JOIN ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
