import connectDB from "@/lib/db";
import Challenge from "@/lib/models/Challenge";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired Session. Login Again...",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const challenges = await Challenge.find(
      { visible: true },
      "-flag -visible -createdAt -updatedAt -solvedBy"
    );

    return NextResponse.json({ success: true, challenges }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
