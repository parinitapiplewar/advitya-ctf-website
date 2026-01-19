import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import "@/lib/models/Challenge";
import "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();

    const teams = await Team.find({})
      .select("name members leader solvedChallenges _id")
      .populate({
        path: "members",
        select: "name _id",
      })
      .populate({
        path: "solvedChallenges",
        select: "name -_id",
      })
      .populate({
        path: "leader",
        select: "name _id",
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        teams,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("FETCH TEAM NAMES ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
