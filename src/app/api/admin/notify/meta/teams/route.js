import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const admin = await User.findById(decoded.userId).select("role");
    if (!admin || decoded.role !== "sudo" || admin.role !== "sudo") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const teams = await Team.find({})
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ success: true, teams, role: admin.role });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
