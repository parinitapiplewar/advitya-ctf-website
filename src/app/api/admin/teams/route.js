import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Team from "@/lib/models/Team";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const adminUser = await User.findById(decoded.userId);

    if (decoded.role === "sudo" && adminUser.role === "sudo") {
      const teams = await Team.find({})
        .select("name score members leader")
        .populate({
          path: "members",
          select: "name email solvedChallenges",
          populate: {
            path: "solvedChallenges",
            select: "name",
          },
        })
        .lean();

      return NextResponse.json(
        { success: true, role: decoded.role, teams },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not Admin" },
        { status: 403 }
      );
    }
  } catch (err) {}
}
