import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import "@/lib/models/Team";
import "@/lib/models/Challenge";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    await connectDB();
    const adminUser = await User.findById(decoded.userId).select("role").lean();

    if (decoded.role === "sudo" && adminUser.role === "sudo") {
      const users = await User.find({})
        .select("name email role team solvedChallenges createdAt")
        .populate({
          path: "team",
          select: "name",
        })
        .populate({
          path: "solvedChallenges",
          select: "name",
        })
        .lean();
      return NextResponse.json(
        { success: true, role: decoded.role, users },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not Admin" },
        { status: 403 },
      );
    }
  } catch (err) {
    console.error("Admin users API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
