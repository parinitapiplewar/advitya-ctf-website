import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PendingUser from "@/lib/models/PendingUser";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

/* ---------------- POST /verify-otp ---------------- */

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp } = body;

    const inputOtp = otp.toString().trim();

    console.log("otp", otp);

    /* ---------- BASIC VALIDATION ---------- */

    if (!email || !inputOtp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(inputOtp)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP format" },
        { status: 400 }
      );
    }

    /* ---------- FIND PENDING USER ---------- */

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return NextResponse.json(
        { success: false, message: "OTP expired or invalid" },
        { status: 404 }
      );
    }

    /* ---------- CHECK OTP EXPIRY ---------- */

    if (pendingUser.otpExpiresAt < new Date()) {
      await PendingUser.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "OTP expired, Register Again" },
        { status: 410 }
      );
    }

    /* ---------- ATTEMPT LIMIT ---------- */

    if (pendingUser.attempts >= 5) {
      await PendingUser.deleteOne({ email });
      return NextResponse.json(
        {
          success: false,
          message: "Too many invalid attempts. Register again.",
        },
        { status: 429 }
      );
    }

    /* ---------- VERIFY OTP ---------- */

    if (pendingUser.otp !== inputOtp) {
      pendingUser.attempts += 1;
      await pendingUser.save();

      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 401 }
      );
    }

    /* ---------- CREATE REAL USER ---------- */

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: "user",
    });

    /* ---------- CLEANUP ---------- */

    await PendingUser.deleteOne({ email });

    /* ---------- ISSUE JWT ---------- */

    const token = jwt.sign(
      { userId: user._id, name:user.name, role: user.role, team: null },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    /* ---------- RESPONSE ---------- */

    return NextResponse.json({
      success: true,
      message: "Registration Successful",
      token: token,
      user: {
        name: user.name,
        id: user._id,
      },
    });


  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
