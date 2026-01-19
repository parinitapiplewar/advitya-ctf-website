import teamSchema from "@/lib/models/Team";
import userSchema from "@/lib/models/User";
import logger from "@/utils/logger";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimiter";

const loginLimiter = rateLimit({ windowMs: 60_000, max: 5 });

export async function POST(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "Unknown";

  try {
    if (!loginLimiter(req)) {
      logger.warn(`💀 Rate limit exceeded on Login attempt | IP: ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts, try again later.",
        },
        { status: 429 }
      );
    }

    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      logger.warn(`⚠️ Login attempt with missing fields →  [IP: ${ip}]`);
      return NextResponse.json(
        { success: false, message: "email and Password required" },
        { status: 400 }
      );
    }

    const user = await userSchema.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid User.. Please Try Again" },
        { status: 400 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid Password.. Please Try Again" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, name:user.name, role: user.role, team: user.team || null },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      message: "Login Success..",
      token: token,
      user: {
        name: user.name,
        id: user._id,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server Error..." },
      { status: 500 }
    );
  }
}
